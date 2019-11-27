import IState from '../interfaces/IState';
import Page from '../enums/page';
import { setDocumentTitle, getUserFriendlyPageName } from '../utility';

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
    }
};
