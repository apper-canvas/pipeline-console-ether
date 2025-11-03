import { toast } from "react-toastify"

class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'deals_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
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
      console.error("Error fetching deals:", error?.response?.data?.message || error)
      toast.error("Failed to load deals")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "name_c"}}},
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
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load deal")
      return null
    }
  }

  async create(dealData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        title_c: dealData.title_c || dealData.title,
        value_c: parseFloat(dealData.value_c || dealData.value || 0),
        stage_c: dealData.stage_c || dealData.stage,
        status_c: dealData.status_c || dealData.status,
        expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
        notes_c: dealData.notes_c || dealData.notes,
        contactId_c: parseInt(dealData.contactId_c || dealData.contactId)
      }
      
      // Remove any empty fields
      Object.keys(createData).forEach(key => {
        if (createData[key] === undefined || createData[key] === null || createData[key] === '' || 
            (key === 'contactId_c' && isNaN(createData[key]))) {
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
          console.error(`Failed to create ${failed.length} deals:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Deal created successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to create deal")
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error)
      toast.error("Failed to create deal")
      throw error
    }
  }

  async update(id, dealData) {
    try {
      // Only include Updateable fields in update operation
      const updateData = {
        Id: id,
        title_c: dealData.title_c || dealData.title,
        value_c: parseFloat(dealData.value_c || dealData.value || 0),
        stage_c: dealData.stage_c || dealData.stage,
        status_c: dealData.status_c || dealData.status,
        expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
        notes_c: dealData.notes_c || dealData.notes,
        contactId_c: parseInt(dealData.contactId_c || dealData.contactId)
      }
      
      // Remove any empty fields except Id
      Object.keys(updateData).forEach(key => {
        if (key !== 'Id' && (updateData[key] === undefined || updateData[key] === null || updateData[key] === '' ||
            (key === 'contactId_c' && isNaN(updateData[key])))) {
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
          console.error(`Failed to update ${failed.length} deals:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Deal updated successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to update deal")
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error)
      toast.error("Failed to update deal")
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
          console.error(`Failed to delete ${failed.length} deals:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Deal deleted successfully!")
        }
        
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error)
      toast.error("Failed to delete deal")
      return false
    }
  }
}

export const dealService = new DealService()