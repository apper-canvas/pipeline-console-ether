import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const ActivityItem = ({ activity, delay = 0 }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "deal_created":
        return "Plus";
      case "deal_updated":
        return "Edit2";
      case "deal_stage_changed":
        return "ArrowRight";
      case "note_added":
        return "MessageSquare";
      case "email_sent":
        return "Mail";
      case "call_made":
        return "Phone";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "deal_created":
        return "text-success bg-green-100";
      case "deal_updated":
        return "text-primary bg-blue-100";
      case "deal_stage_changed":
        return "text-purple-600 bg-purple-100";
      case "note_added":
        return "text-orange-600 bg-orange-100";
      case "email_sent":
        return "text-indigo-600 bg-indigo-100";
      case "call_made":
        return "text-pink-600 bg-pink-100";
      default:
        return "text-secondary bg-slate-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start space-x-3 py-3 border-b border-slate-100 last:border-b-0"
    >
      <motion.div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)} flex-shrink-0`}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-secondary mt-1">
          {formatDate(activity.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

export default ActivityItem;