import { toast } from "react-toastify"

class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'activities_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
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
      console.error("Error fetching activities:", error?.response?.data?.message || error)
      toast.error("Failed to load activities")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
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
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load activity")
      return null
    }
  }

  async create(activityData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        contactId_c: activityData.contactId_c || activityData.contactId,
        dealId_c: activityData.dealId_c || activityData.dealId,
        type_c: activityData.type_c || activityData.type,
        description_c: activityData.description_c || activityData.description,
        timestamp_c: activityData.timestamp_c || activityData.timestamp || new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} activities:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Activity created successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to create activity")
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error)
      toast.error("Failed to create activity")
      throw error
    }
  }

  async update(id, activityData) {
    try {
      // Only include Updateable fields in update operation
      const updateData = {
        Id: id,
        contactId_c: activityData.contactId_c || activityData.contactId,
        dealId_c: activityData.dealId_c || activityData.dealId,
        type_c: activityData.type_c || activityData.type,
        description_c: activityData.description_c || activityData.description,
        timestamp_c: activityData.timestamp_c || activityData.timestamp
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
          console.error(`Failed to update ${failed.length} activities:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Activity updated successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to update activity")
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error)
      toast.error("Failed to update activity")
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
          console.error(`Failed to delete ${failed.length} activities:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Activity deleted successfully!")
        }
        
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error)
      toast.error("Failed to delete activity")
      return false
    }
  }
}

export const activityService = new ActivityService()