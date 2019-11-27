import { Router, NextFunction, Request, Response } from 'express';
import IRouteExport from '../interfaces/IRouteExport';

class IndexController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getIndex);
    }

    private getIndex = (req: Request, res: Response, next: NextFunction) => {
        res.send('<p>Hello World</p>');
    }
}

const exported: IRouteExport = {
    path: '/',
    router: new IndexController().router
};

export default exported;
