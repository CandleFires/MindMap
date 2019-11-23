import IState from '@/interfaces/IState';

export default {
    login (state: IState, username: string) {
        state.loggedIn = true;
        state.user = username;
    },
    logout (state: IState) {
        state.loggedIn = false;
        state.user = '';
    }
};
