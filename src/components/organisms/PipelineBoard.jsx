import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import DealCard from "@/components/molecules/DealCard";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { pipelineStageService } from "@/services/api/pipelineStageService";
import { activityService } from "@/services/api/activityService";

const PipelineBoard = ({ onEditDeal, onDeleteDeal }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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
      setError("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getDealsByStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName && deal.status === "active");
  };

  const getStageValue = (stageName) => {
    const stageDeals = getDealsByStage(stageName);
    return stageDeals.reduce((total, deal) => total + (deal.value || 0), 0);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.target.style.opacity = "0.7";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedDeal(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    if (!draggedDeal || draggedDeal.stage === targetStage) {
      return;
    }

    try {
      const updatedDeal = {
        ...draggedDeal,
        stage: targetStage
      };

      await dealService.update(draggedDeal.Id, updatedDeal);
      
      // Log activity
      await activityService.create({
        contactId: draggedDeal.contactId,
        dealId: draggedDeal.Id,
        type: "deal_stage_changed",
        description: `Deal "${draggedDeal.title}" moved from ${draggedDeal.stage} to ${targetStage}`,
        timestamp: new Date().toISOString()
      });

      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id 
          ? { ...deal, stage: targetStage }
          : deal
      ));

      toast.success("Deal stage updated successfully!");
    } catch (error) {
      toast.error("Failed to update deal stage");
    }
  };

  if (loading) return <Loading variant="kanban" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-6 min-w-max pb-6">
        <AnimatePresence>
          {stages.map((stage, stageIndex) => {
            const stageDeals = getDealsByStage(stage.name);
            const stageValue = getStageValue(stage.name);

            return (
              <motion.div
                key={stage.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: stageIndex * 0.1 }}
                className="flex-shrink-0 w-80"
              >
                <div
                  className="bg-slate-100 rounded-xl p-4 h-full min-h-[600px] transition-all duration-200"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.name)}
                >
                  {/* Stage Header */}
                  <motion.div
                    className="mb-4 p-3 bg-white rounded-lg shadow-sm border-l-4"
                    style={{ borderLeftColor: stage.color }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: stageIndex * 0.1 + 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{stage.name}</h3>
                      <motion.div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: stage.color }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {stageDeals.length}
                      </motion.div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary">
                      <ApperIcon name="DollarSign" className="w-4 h-4" />
                      <span className="font-semibold text-primary">
                        {formatCurrency(stageValue)}
                      </span>
                    </div>
                  </motion.div>

                  {/* Deal Cards */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {stageDeals.length > 0 ? (
                        stageDeals.map((deal, dealIndex) => (
                          <motion.div
                            key={deal.Id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: dealIndex * 0.05 }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, deal)}
                            onDragEnd={handleDragEnd}
                          >
                            <DealCard
                              deal={deal}
                              contact={getContactById(deal.contactId)}
                              onEdit={onEditDeal}
                              onDelete={onDeleteDeal}
                              isDragging={draggedDeal?.Id === deal.Id}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: stageIndex * 0.1 + 0.3 }}
                          className="text-center py-8"
                        >
                          <ApperIcon name="Inbox" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm text-slate-500">No deals in this stage</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PipelineBoard;