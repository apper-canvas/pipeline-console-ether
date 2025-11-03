import mockData from "@/services/mockData/pipelineStages.json";

class PipelineStageService {
  constructor() {
    this.stages = [...mockData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(200);
    return [...this.stages];
  }

  async getById(id) {
    await this.delay(200);
    const stage = this.stages.find(s => s.Id === id);
    if (!stage) {
      throw new Error("Stage not found");
    }
    return { ...stage };
  }

  async create(stageData) {
    await this.delay(400);
    const newStage = {
      Id: Math.max(...this.stages.map(s => s.Id)) + 1,
      ...stageData
    };
    this.stages.push(newStage);
    return { ...newStage };
  }

  async update(id, stageData) {
    await this.delay(400);
    const index = this.stages.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Stage not found");
    }
    
    const updatedStage = {
      ...this.stages[index],
      ...stageData,
      Id: id
    };
    
    this.stages[index] = updatedStage;
    return { ...updatedStage };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.stages.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Stage not found");
    }
    
    this.stages.splice(index, 1);
    return true;
  }
}

export const pipelineStageService = new PipelineStageService();