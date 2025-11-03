import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const DealCard = ({ 
  deal, 
  contact, 
  onEdit, 
  onDelete, 
  isDragging = false,
  ...dragProps 
}) => {
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
      return format(new Date(dateString), "MMM d");
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

  return (
    <motion.div
      {...dragProps}
      className={`cursor-move ${isDragging ? "dragging" : ""}`}
      whileHover={!isDragging ? { y: -2, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className="p-4 group hover:shadow-hover transition-all duration-200 bg-white border-l-4 border-l-primary">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight">
{deal.title_c}
          </h4>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deal);
              }}
              className="p-1 text-slate-400 hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name="Edit2" className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deal);
              }}
              className="p-1 text-slate-400 hover:text-error transition-colors duration-200"
            >
              <ApperIcon name="Trash2" className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
<span className="text-lg font-bold text-gradient">
              {formatCurrency(deal.value_c)}
            </span>
            <Badge variant={getStatusColor(deal.status_c)} size="sm">
              {deal.status_c}
            </Badge>
          </div>

{contact && (
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <ApperIcon name="User" className="w-3 h-3" />
              <span>{contact.name_c}</span>
            </div>
          )}

{deal.expectedCloseDate_c && (
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <ApperIcon name="Calendar" className="w-3 h-3" />
              <span>{formatDate(deal.expectedCloseDate_c)}</span>
            </div>
          )}
        </div>

        <motion.div 
          className="w-full h-1 bg-slate-200 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default DealCard;