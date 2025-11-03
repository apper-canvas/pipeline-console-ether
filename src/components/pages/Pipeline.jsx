import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealForm from "@/components/organisms/DealForm";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { pipelineStageService } from "@/services/api/pipelineStageService";
import { activityService } from "@/services/api/activityService";

const Pipeline = () => {
  const { onMenuClick } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsData, stagesData] = await Promise.all([
        contactService.getAll(),
        pipelineStageService.getAll()
      ]);
      
      setContacts(contactsData);
      setStages(stagesData.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleCreateDeal = () => {
    setSelectedDeal(null);
    setShowForm(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowForm(true);
  };

  const handleDeleteDeal = async (deal) => {
    if (!confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      return;
    }

    try {
      await dealService.delete(deal.Id);
      
      // Log activity
await activityService.create({
        contactId_c: deal.contactId_c,
        dealId_c: deal.Id,
        type_c: "deal_deleted",
        description_c: `Deal "${deal.title_c}" was deleted`,
        timestamp_c: new Date().toISOString()
      });

      toast.success("Deal deleted successfully!");
      // The PipelineBoard component will handle refreshing the data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  const handleSaveDeal = async (dealData) => {
    setFormLoading(true);
    try {
      let savedDeal;
      
      if (selectedDeal) {
        savedDeal = await dealService.update(selectedDeal.Id, dealData);
        
        // Log activity
await activityService.create({
          contactId_c: dealData.contactId_c,
          dealId_c: selectedDeal.Id,
          type_c: "deal_updated",
          description_c: `Deal "${dealData.title_c}" was updated`,
          timestamp_c: new Date().toISOString()
        });
      } else {
        savedDeal = await dealService.create(dealData);
        
        // Log activity
await activityService.create({
          contactId_c: dealData.contactId_c,
          dealId_c: savedDeal.Id,
          type_c: "deal_created",
          description_c: `Deal "${dealData.title_c}" was created with value ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(dealData.value_c)}`,
          timestamp_c: new Date().toISOString()
        });
      }
      
      setShowForm(false);
      setSelectedDeal(null);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDeal(null);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Sales Pipeline"
        onMenuClick={onMenuClick}
        action={
          <Button onClick={handleCreateDeal} className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Deal</span>
          </Button>
        }
      />
      
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <PipelineBoard
          onEditDeal={handleEditDeal}
          onDeleteDeal={handleDeleteDeal}
        />
      </motion.div>

      {/* Deal Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedDeal ? "Edit Deal" : "Add New Deal"}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          stages={stages}
          onSave={handleSaveDeal}
          onCancel={handleCloseForm}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Pipeline;