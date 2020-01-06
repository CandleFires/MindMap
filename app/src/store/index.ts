import Vue from 'vue';
import Vuex from 'vuex';
import IState from '../interfaces/IState';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import Page from '../enums/page';

Vue.use(Vuex);

const state: IState = {
    loggedIn: false,
    user: '',
    token: '',
    page: Page.MapList,
    currentMapName: '',
    savedMaps: {}
};

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});
