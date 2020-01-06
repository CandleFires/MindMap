import Page from '../enums/page';
import IMap from './IMap';
import IDictionary from './IDictionary';

export default interface IState {
    loggedIn: boolean;
    user: string;
    token: string;
    page: Page;
    currentMapName: string;
    savedMaps: IDictionary<IMap>;
};
