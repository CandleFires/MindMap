import { Router, NextFunction, Request, Response } from 'express';
import IRouteExport from '../interfaces/IRouteExport';
import Crypto from '../crypto';

class LoginController {
    public router: Router;
    
    constructor() {
        this.router = Router();
        this.router.post('/login', this.login);    
    }

    private login = (req: Request, res: Response, next: NextFunction) => {
        if (req.body.username) {
            const token = Crypto.encrypt(req.body.username);
            res.status(200).send({ token });
        } else {
            res.sendStatus(400);
        }
    }
}

const exported: IRouteExport = {
    path: '/',
    router: new LoginController().router
};

export default exported;
