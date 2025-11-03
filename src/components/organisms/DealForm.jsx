import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DealForm = ({ deal, contacts = [], stages = [], onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
title_c: "",
    value_c: "",
    contactId_c: "",
    stage_c: "Lead",
    status_c: "active",
    expectedCloseDate_c: "",
    notes_c: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
if (deal) {
      setFormData({
        title_c: deal.title_c || "",
        value_c: deal.value_c || "",
        contactId_c: deal.contactId_c || "",
        stage_c: deal.stage_c || "Lead",
        status_c: deal.status_c || "active",
        expectedCloseDate_c: deal.expectedCloseDate_c || "",
        notes_c: deal.notes_c || ""
      });
    }
  }, [deal]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact";
    }

    if (!formData.stage) {
      newErrors.stage = "Please select a stage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const dealData = {
...formData,
      value_c: parseFloat(formData.value_c)
    };

    try {
      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully!" : "Deal created successfully!");
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Deal Title"
          value={formData.title}
          onChange={handleChange("title")}
          error={errors.title}
          placeholder="Enter deal title"
          disabled={isLoading}
        />
        
        <Input
          label="Deal Value"
          type="number"
          min="0"
          step="0.01"
          value={formData.value}
          onChange={handleChange("value")}
          error={errors.value}
          placeholder="Enter deal value"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Contact"
          value={formData.contactId}
          onChange={handleChange("contactId")}
          error={errors.contactId}
          placeholder="Select a contact"
          disabled={isLoading}
        >
{contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name_c} - {contact.company_c}
            </option>
          ))}
        </Select>
        
        <Select
          label="Stage"
          value={formData.stage}
          onChange={handleChange("stage")}
          error={errors.stage}
          disabled={isLoading}
        >
{stages.map(stage => (
            <option key={stage.Id} value={stage.name_c}>
              {stage.name_c}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Expected Close Date"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange("expectedCloseDate")}
          disabled={isLoading}
        />
        
        <Select
          label="Status"
          value={formData.status}
          onChange={handleChange("status")}
          disabled={isLoading}
        >
          <option value="active">Active</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </Select>
      </div>

      <Textarea
        label="Notes"
        value={formData.notes}
        onChange={handleChange("notes")}
        placeholder="Add any additional notes about this deal..."
        rows={4}
        disabled={isLoading}
      />

      <motion.div
        className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          className="flex items-center space-x-2"
        >
          <ApperIcon name={deal ? "Save" : "Plus"} className="w-4 h-4" />
          <span>{deal ? "Update Deal" : "Create Deal"}</span>
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default DealForm;