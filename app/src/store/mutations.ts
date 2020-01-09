import IState from '../interfaces/IState';
import Page from '../enums/page';
import { setDocumentTitle, getUserFriendlyPageName } from '../utility';
import IMap from '../interfaces/IMap';
import Vue from 'vue';
import IPopup from '../interfaces/IPopup';

export default {
    login (state: IState, params: { username: string, token: string }) {
        state.loggedIn = true;
        state.user = params.username;
        state.token = params.token;
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
    setMaps (state: IState, maps: Array<IMap>) {
        Vue.set(state, 'savedMaps', {});
        maps.forEach((map) => {
            Vue.set(state.savedMaps, map.name, map);
        });
    },
    showPopup (state: IState, popup: IPopup) {
        state.popup.cancellationText = popup.cancellationText;
        state.popup.confirmationText = popup.confirmationText;
        state.popup.text = popup.text;
        state.popup.title = popup.text;
        state.popup.shown = true;
    },
    hidePopup (state: IState) {
        state.popup.cancellationText = '';
        state.popup.confirmationText = '';
        state.popup.text = '';
        state.popup.title = '';
        state.popup.shown = false;
        state.popup.result = null;
    },
    updatePopupStatus (state: IState, result: 'good' | 'bad') {
        state.popup.result = result;
    }
};
