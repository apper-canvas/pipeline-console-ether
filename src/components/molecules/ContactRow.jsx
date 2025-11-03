import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ContactRow = ({ contact, onView, onEdit, onDelete, delay = 0 }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
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

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="hover:bg-slate-50 transition-colors duration-200 group"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {getInitials(contact.name)}
          </motion.div>
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
              {contact.name}
            </div>
            <div className="text-sm text-secondary">{contact.email}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{contact.company}</div>
        <div className="text-sm text-secondary">{contact.phone}</div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {contact.tags && contact.tags.length > 0 ? (
            contact.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="primary" size="sm">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-secondary">No tags</span>
          )}
          {contact.tags && contact.tags.length > 2 && (
            <Badge variant="default" size="sm">
              +{contact.tags.length - 2}
            </Badge>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className="text-sm text-secondary">
          {formatDate(contact.createdAt)}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(contact)}
            className="p-2 h-8 w-8"
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(contact)}
            className="p-2 h-8 w-8"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contact)}
            className="p-2 h-8 w-8 text-error hover:text-error"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ContactRow;