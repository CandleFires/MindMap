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
    page: Page.MapList,
    currentMapName: '',
    savedMaps: {
        "Example Map": {
            name: "Example Map",
            thoughts: [
                {
                    id: "164c2bb7-2f9d-4b6f-ae6b-a2a901ff17c3",
                    x: 0,
                    y: 0,
                    size: 0,
                    text: "Main Thought",
                    connections: [
                        "a76d990c-6687-4cc8-b9c6-4569d9040ded",
                        "c99b6605-551f-4fc9-97cf-ac60c804a032"
                    ]
                },
                {
                    id: "a76d990c-6687-4cc8-b9c6-4569d9040ded",
                    x: 144,
                    y: -123,
                    size: 1,
                    text: "Side Thought 1",
                    connections: [
                        "164c2bb7-2f9d-4b6f-ae6b-a2a901ff17c3",
                        "62d91b47-3fc3-4229-90d4-9075f774feab"
                    ]
                },
                {
                    id: "c99b6605-551f-4fc9-97cf-ac60c804a032",
                    x: -237,
                    y: 99,
                    size: 1,
                    text: "Side Thought 2",
                    connections: [
                        "164c2bb7-2f9d-4b6f-ae6b-a2a901ff17c3"
                    ]
                },
                {
                    id: "62d91b47-3fc3-4229-90d4-9075f774feab",
                    x: 290,
                    y: 4,
                    size: 2,
                    text: "Side Thought 1.1",
                    connections: [
                        "a76d990c-6687-4cc8-b9c6-4569d9040ded",
                        "41fd66af-00f4-4b88-b695-b63948b26bb1"
                    ]
                }
            ]
        }
    }
};

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});
