import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found",
  message = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction,
  icon = "Inbox",
  variant = "default"
}) => {
  if (variant === "compact") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name={icon} className="w-8 h-8 text-slate-400 mb-3" />
        <p className="text-secondary text-sm mb-4">{message}</p>
        {onAction && (
          <Button size="sm" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold text-gray-900 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-secondary mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {message}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button onClick={onAction} className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>{actionText}</span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;