import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Header from "@/components/organisms/Header";
import DealForm from "@/components/organisms/DealForm";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { pipelineStageService } from "@/services/api/pipelineStageService";
import { activityService } from "@/services/api/activityService";

const Deals = () => {
  const { onMenuClick } = useOutletContext();
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredDeals(deals);
  }, [deals]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData, stagesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        pipelineStageService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
      setStages(stagesData.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError("Failed to load deals data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredDeals(deals);
      return;
    }

const filtered = deals.filter(deal => {
      const contact = getContactById(deal.contactId_c);
      return (
        deal.title_c?.toLowerCase().includes(query.toLowerCase()) ||
        deal.stage_c?.toLowerCase().includes(query.toLowerCase()) ||
        (contact && contact.name_c?.toLowerCase().includes(query.toLowerCase())) ||
        (contact && contact.company_c?.toLowerCase().includes(query.toLowerCase()))
      );
    });
    setFilteredDeals(filtered);
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
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
      setDeals(prev => prev.filter(d => d.Id !== deal.Id));
      
      // Log activity
await activityService.create({
        contactId_c: deal.contactId_c,
        dealId_c: deal.Id,
        type_c: "deal_deleted",
        description_c: `Deal "${deal.title_c}" was deleted`,
        timestamp_c: new Date().toISOString()
      });

      toast.success("Deal deleted successfully!");
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
        setDeals(prev => prev.map(d => d.Id === selectedDeal.Id ? savedDeal : d));
        
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
        setDeals(prev => [savedDeal, ...prev]);
        
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

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "won":
        return "success";
      case "lost":
        return "error";
      default:
        return "primary";
    }
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen">
      <Header
        title="Deals"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
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
        {filteredDeals.length === 0 ? (
          <Empty
            title="No deals found"
            message="Start tracking your sales opportunities by creating your first deal."
            actionText="Add First Deal"
            onAction={handleCreateDeal}
            icon="Target"
          />
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Close Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  <AnimatePresence>
{filteredDeals.map((deal, index) => {
                      const contact = getContactById(deal.contactId_c);
                      
                      return (
                        <motion.tr
                          key={deal.Id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                              {deal.title_c}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            {contact ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{contact.name_c}</div>
                                <div className="text-sm text-secondary">{contact.company_c}</div>
                              </div>
                            ) : (
                              <span className="text-sm text-secondary">Contact not found</span>
                            )}
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gradient">
                              {formatCurrency(deal.value_c)}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className="text-sm text-secondary">{deal.stage_c}</span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <Badge variant={getStatusColor(deal.status_c)}>
                              {deal.status_c}
                            </Badge>
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className="text-sm text-secondary">
                              {formatDate(deal.expectedCloseDate_c)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDeal(deal)}
                                className="p-2 h-8 w-8"
                              >
                                <ApperIcon name="Edit2" className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDeal(deal)}
                                className="p-2 h-8 w-8 text-error hover:text-error"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
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

export default Deals;