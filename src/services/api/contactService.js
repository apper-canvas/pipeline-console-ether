import { toast } from "react-toastify"

class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'contacts_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error)
      toast.error("Failed to load contacts")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load contact")
      return null
    }
  }

  async create(contactData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        name_c: contactData.name_c || contactData.name,
        email_c: contactData.email_c || contactData.email,
        phone_c: contactData.phone_c || contactData.phone,
        company_c: contactData.company_c || contactData.company,
        notes_c: contactData.notes_c || contactData.notes,
        tags_c: contactData.tags_c || (Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags)
      }
      
      // Remove any empty fields
      Object.keys(createData).forEach(key => {
        if (createData[key] === undefined || createData[key] === null || createData[key] === '') {
          delete createData[key]
        }
      })
      
      const params = {
        records: [createData]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Contact created successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to create contact")
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error)
      toast.error("Failed to create contact")
      throw error
    }
  }

  async update(id, contactData) {
    try {
      // Only include Updateable fields in update operation
      const updateData = {
        Id: id,
        name_c: contactData.name_c || contactData.name,
        email_c: contactData.email_c || contactData.email,
        phone_c: contactData.phone_c || contactData.phone,
        company_c: contactData.company_c || contactData.company,
        notes_c: contactData.notes_c || contactData.notes,
        tags_c: contactData.tags_c || (Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags)
      }
      
      // Remove any empty fields except Id
      Object.keys(updateData).forEach(key => {
        if (key !== 'Id' && (updateData[key] === undefined || updateData[key] === null || updateData[key] === '')) {
          delete updateData[key]
        }
      })
      
      const params = {
        records: [updateData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Contact updated successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to update contact")
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error)
      toast.error("Failed to update contact")
      throw error
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Contact deleted successfully!")
        }
        
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error)
      toast.error("Failed to delete contact")
      return false
    }
  }
}

export const contactService = new ContactService()