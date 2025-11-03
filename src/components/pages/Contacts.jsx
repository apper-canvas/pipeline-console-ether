import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ContactRow from "@/components/molecules/ContactRow";
import ContactForm from "@/components/organisms/ContactForm";
import ContactDetails from "@/components/organisms/ContactDetails";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";

const Contacts = () => {
  const { onMenuClick } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase()) ||
      contact.company.toLowerCase().includes(query.toLowerCase()) ||
      (contact.tags && contact.tags.some(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      ))
    );
    setFilteredContacts(filtered);
  };

  const handleCreateContact = () => {
    setSelectedContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDetails(true);
  };

  const handleDeleteContact = async (contact) => {
    if (!confirm(`Are you sure you want to delete ${contact.name}?`)) {
      return;
    }

    try {
      await contactService.delete(contact.Id);
      setContacts(prev => prev.filter(c => c.Id !== contact.Id));
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleSaveContact = async (contactData) => {
    setFormLoading(true);
    try {
      let savedContact;
      
      if (selectedContact) {
        savedContact = await contactService.update(selectedContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? savedContact : c));
        
        // Log activity
        await activityService.create({
          contactId: selectedContact.Id,
          type: "contact_updated",
          description: `Contact "${contactData.name}" was updated`,
          timestamp: new Date().toISOString()
        });
      } else {
        savedContact = await contactService.create(contactData);
        setContacts(prev => [savedContact, ...prev]);
        
        // Log activity
        await activityService.create({
          contactId: savedContact.Id,
          type: "contact_created",
          description: `Contact "${contactData.name}" was created`,
          timestamp: new Date().toISOString()
        });
      }
      
      setShowForm(false);
      setSelectedContact(null);
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedContact(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedContact(null);
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="min-h-screen">
      <Header
        title="Contacts"
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
        action={
          <Button onClick={handleCreateContact} className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Contact</span>
          </Button>
        }
      />
      
      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {filteredContacts.length === 0 ? (
          <Empty
            title="No contacts found"
            message="Get started by adding your first contact to begin building your customer relationships."
            actionText="Add First Contact"
            onAction={handleCreateContact}
            icon="Users"
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
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Company & Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredContacts.map((contact, index) => (
                      <ContactRow
                        key={contact.Id}
                        contact={contact}
                        onView={handleViewContact}
                        onEdit={handleEditContact}
                        onDelete={handleDeleteContact}
                        delay={index * 0.05}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Contact Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={handleCloseForm}
          isLoading={formLoading}
        />
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={handleCloseDetails}
        title=""
        size="xl"
        showCloseButton={false}
      >
        {selectedContact && (
          <ContactDetails
            contact={selectedContact}
            onEdit={() => {
              setShowDetails(false);
              setShowForm(true);
            }}
            onClose={handleCloseDetails}
          />
        )}
      </Modal>
    </div>
  );
};

export default Contacts;