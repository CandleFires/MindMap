import Page from '../enums/page';
import IMap from './IMap';
import IDictionary from './IDictionary';
import IPopup from './IPopup';

export default interface IState {
    loggedIn: boolean;
    user: string;
    token: string;
    page: Page;
    unsavedChanges: boolean;
    currentMapName: string;
    savedMaps: IDictionary<IMap>;
    popup: IPopup;
};
