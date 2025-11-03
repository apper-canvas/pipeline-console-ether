import mockData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...mockData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await this.delay(200);
    const activity = this.activities.find(a => a.Id === id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await this.delay(400);
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    };
    this.activities.unshift(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay(400);
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: id
    };
    
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return true;
  }
}

export const activityService = new ActivityService();