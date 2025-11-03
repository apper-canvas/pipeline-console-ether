import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ContactForm = ({ contact, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    tags_c: "",
    notes_c: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
if (contact) {
      setFormData({
        name_c: contact.name_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        company_c: contact.company_c || "",
        tags_c: contact.tags_c ? (typeof contact.tags_c === 'string' ? contact.tags_c : contact.tags_c.join(", ")) : "",
        notes_c: contact.notes_c || ""
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
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

    const contactData = {
...formData,
      tags_c: formData.tags_c
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .join(",")
    };

    try {
      await onSave(contactData);
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
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
          label="Full Name"
          value={formData.name}
          onChange={handleChange("name")}
          error={errors.name}
          placeholder="Enter full name"
          disabled={isLoading}
        />
        
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          error={errors.email}
          placeholder="Enter email address"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange("phone")}
          error={errors.phone}
          placeholder="Enter phone number"
          disabled={isLoading}
        />
        
        <Input
          label="Company"
          value={formData.company}
          onChange={handleChange("company")}
          error={errors.company}
          placeholder="Enter company name"
          disabled={isLoading}
        />
      </div>

      <Input
        label="Tags"
        value={formData.tags}
        onChange={handleChange("tags")}
        placeholder="Enter tags separated by commas (e.g., VIP, Lead, Partner)"
        disabled={isLoading}
      />

      <Textarea
        label="Notes"
        value={formData.notes}
        onChange={handleChange("notes")}
        placeholder="Add any additional notes about this contact..."
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
          <ApperIcon name={contact ? "Save" : "Plus"} className="w-4 h-4" />
          <span>{contact ? "Update Contact" : "Create Contact"}</span>
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default ContactForm;