import DashboardModel from '../models/DashboardModel.js';

class DashboardService {
    static async getStats() {
        return await DashboardModel.getStats();
    }
}

export default DashboardService;
