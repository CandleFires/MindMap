import IState from '../interfaces/IState';
import Page from '../enums/page';
import { setDocumentTitle, getUserFriendlyPageName } from '../utility';
import IMap from '../interfaces/IMap';
import Vue from 'vue';

export default {
    login (state: IState, username: string) {
        state.loggedIn = true;
        state.user = username;
    },
    logout (state: IState) {
        state.loggedIn = false;
        state.user = '';
    },
    changePage (state: IState, page: Page) {
        state.page = page;
        setDocumentTitle(getUserFriendlyPageName(page));
    },
    changeMapName (state: IState, mapName: string) {
        state.currentMapName = mapName;
    },
    saveMap (state: IState, map: IMap) {
        Vue.set(state.savedMaps, map.name, map);
    }
};
