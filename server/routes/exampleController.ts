import { Router, NextFunction, Request, Response } from 'express';
import IRouteExport from '../interfaces/IRouteExport';

class ExampleController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getEx);
    }

    private getEx = (req: Request, res: Response, next: NextFunction) => {
        res.send('Hello World');
    }
}

const exported: IRouteExport = {
    path: '/example',
    router: new ExampleController().router
};

export default exported;
