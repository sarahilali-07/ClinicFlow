import DashboardService from '../services/DashboardService.js';

class DashboardController {
    static getStats = async (req, res, next) => {
        try {
            const stats = await DashboardService.getStats();
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    };
}

export default DashboardController;
