import { Router, NextFunction, Request, Response } from 'express';
import IRouteExport from '../interfaces/IRouteExport';
import Crypto from '../crypto';
import Database from '../database';

class MapController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getMaps);
        this.router.post('/', this.saveMap);
        this.router.delete('/:id', this.deleteMap);
    }

    private getMaps = (req: Request, res: Response, next: NextFunction) => {
        const username = this.getName(req.headers.authorization);
        const db = Database.instance;
        db.all('SELECT * FROM maps WHERE owner = ?', [ username ] , (err, rows) => {
            if (err) {
                res.status(500).send(err);
            }
            const maps = rows.map((row) => {
                const map = JSON.parse(row.map);
                return {
                    id: row.id,
                    name: map.name,
                    thoughts: map.thoughts
                };
            });

            res.status(200).json(maps);
        });
    }

    private saveMap = (req: Request, res: Response, next: NextFunction) => {
        const username = this.getName(req.headers.authorization);
        const db = Database.instance;
        const map = JSON.stringify({ name: req.body.name, thoughts: req.body.thoughts });
        const callback = (err: Error) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.sendStatus(200);
            }
        };
        if (req.body.id) {
            db.run('UPDATE maps SET map = ? WHERE id = ?', [ map , req.body.id ], callback);
        } else {
            db.run('INSERT INTO maps(owner, map) VALUES(?, ?)', [ username, map ], callback);
        }
    }

    private deleteMap = (req: Request, res: Response, next: NextFunction) => {
        const username = this.getName(req.headers.authorization);
        const db = Database.instance;
        db.run('DELETE FROM maps WHERE id = ? AND owner = ?', [ req.params.id, username ], (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.sendStatus(200);
            }
        });
    }

    private getName(token: string | undefined) {
        if (token) {
            return Crypto.decrypt(token.replace('Bearer ', ''));
        }

        throw Error('No username provided in token');
    }
}

const exported: IRouteExport = {
    path: '/maps',
    router: new MapController().router
};

export default exported;
