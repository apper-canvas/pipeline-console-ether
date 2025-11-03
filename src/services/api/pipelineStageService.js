import { toast } from "react-toastify"

class PipelineStageService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'pipelineStages_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching pipeline stages:", error?.response?.data?.message || error)
      toast.error("Failed to load pipeline stages")
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
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
      console.error(`Error fetching pipeline stage ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load pipeline stage")
      return null
    }
  }

  async create(stageData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        name_c: stageData.name_c || stageData.name,
        color_c: stageData.color_c || stageData.color,
        order_c: parseInt(stageData.order_c || stageData.order || 0)
      }
      
      // Remove any empty fields
      Object.keys(createData).forEach(key => {
        if (createData[key] === undefined || createData[key] === null || createData[key] === '' ||
            (key === 'order_c' && isNaN(createData[key]))) {
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
          console.error(`Failed to create ${failed.length} pipeline stages:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pipeline stage created successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to create pipeline stage")
    } catch (error) {
      console.error("Error creating pipeline stage:", error?.response?.data?.message || error)
      toast.error("Failed to create pipeline stage")
      throw error
    }
  }

  async update(id, stageData) {
    try {
      // Only include Updateable fields in update operation
      const updateData = {
        Id: id,
        name_c: stageData.name_c || stageData.name,
        color_c: stageData.color_c || stageData.color,
        order_c: parseInt(stageData.order_c || stageData.order || 0)
      }
      
      // Remove any empty fields except Id
      Object.keys(updateData).forEach(key => {
        if (key !== 'Id' && (updateData[key] === undefined || updateData[key] === null || updateData[key] === '' ||
            (key === 'order_c' && isNaN(updateData[key])))) {
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
          console.error(`Failed to update ${failed.length} pipeline stages:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pipeline stage updated successfully!")
          return successful[0].data
        }
      }
      
      throw new Error("Failed to update pipeline stage")
    } catch (error) {
      console.error("Error updating pipeline stage:", error?.response?.data?.message || error)
      toast.error("Failed to update pipeline stage")
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
          console.error(`Failed to delete ${failed.length} pipeline stages:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pipeline stage deleted successfully!")
        }
        
        return successful.length === 1
      }
      
      return false
    } catch (error) {
      console.error("Error deleting pipeline stage:", error?.response?.data?.message || error)
      toast.error("Failed to delete pipeline stage")
      return false
    }
  }
}

export const pipelineStageService = new PipelineStageService()