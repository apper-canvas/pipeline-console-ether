import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ActivityItem from "@/components/molecules/ActivityItem";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

const ContactDetails = ({ contact, onEdit, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "deals", label: "Deals", icon: "Target" },
    { id: "activity", label: "Activity", icon: "Clock" }
  ];

  useEffect(() => {
    if (activeTab === "deals") {
      loadDeals();
    } else if (activeTab === "activity") {
      loadActivities();
    }
  }, [activeTab, contact.Id]);

  const loadDeals = async () => {
    setLoading(true);
    setError("");
    try {
      const allDeals = await dealService.getAll();
      const contactDeals = allDeals.filter(deal => deal.contactId === contact.Id);
      setDeals(contactDeals);
    } catch (err) {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const allActivities = await activityService.getAll();
      const contactActivities = allActivities.filter(activity => activity.contactId === contact.Id);
      setActivities(contactActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
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
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-gray-900">{contact.email}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-gray-900">{contact.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Building2" className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-gray-900">{contact.company}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {contact.tags && contact.tags.length > 0 ? (
                  contact.tags.map((tag, index) => (
                    <Badge key={index} variant="primary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-secondary">No tags</span>
                )}
              </div>
            </div>

            {contact.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <p className="text-sm text-gray-900 bg-slate-50 rounded-lg p-3">
                  {contact.notes}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
              <span className="text-sm text-secondary">{formatDate(contact.createdAt)}</span>
            </div>
          </motion.div>
        );

      case "deals":
        if (loading) return <Loading variant="card" />;
        if (error) return <Error message={error} onRetry={loadDeals} variant="inline" />;
        if (deals.length === 0) return <Empty title="No deals found" message="This contact doesn't have any deals yet." variant="compact" />;
        
        return (
          <motion.div
            key="deals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {deals.map((deal, index) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                  <Badge variant={deal.status === "won" ? "success" : deal.status === "lost" ? "error" : "primary"}>
                    {deal.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-secondary">
                  <span>Value: <span className="font-semibold text-primary">{formatCurrency(deal.value)}</span></span>
                  <span>Stage: {deal.stage}</span>
                </div>
                {deal.expectedCloseDate && (
                  <div className="text-sm text-secondary mt-1">
                    Expected close: {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        );

      case "activity":
        if (loading) return <Loading variant="card" />;
        if (error) return <Error message={error} onRetry={loadActivities} variant="inline" />;
        if (activities.length === 0) return <Empty title="No activity found" message="No recent activity for this contact." variant="compact" />;
        
        return (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {activities.map((activity, index) => (
              <ActivityItem key={activity.Id} activity={activity} delay={index * 0.05} />
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Contact Header */}
      <motion.div
        className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {getInitials(contact.name)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
          <p className="text-secondary">{contact.company}</p>
        </div>
        <Button onClick={onEdit} className="flex items-center space-x-2">
          <ApperIcon name="Edit2" className="w-4 h-4" />
          <span>Edit</span>
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-100 rounded-lg p-1">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {renderTabContent()}
      </AnimatePresence>
    </div>
  );
};

export default ContactDetails;