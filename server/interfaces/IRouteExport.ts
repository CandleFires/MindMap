import { Router } from 'express';

export default interface IRouteExport {
    path: string;
    router: Router;
}
