import { Router, NextFunction, Request, Response } from 'express';
import IRouteExport from '../interfaces/IRouteExport';

class MapController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getMaps);
    }

    private getMaps = (req: Request, res: Response, next: NextFunction) => {
        res.json([]);
    }
}

const exported: IRouteExport = {
    path: '/maps',
    router: new MapController().router
};

export default exported;
