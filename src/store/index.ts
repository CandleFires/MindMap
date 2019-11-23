import Vue from 'vue';
import Vuex from 'vuex';
import IState from '@/interfaces/IState';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const state: IState = {
    loggedIn: false,
    user: ''
};

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});
