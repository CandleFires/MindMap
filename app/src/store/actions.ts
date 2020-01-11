import { ActionContext } from 'vuex';
import IState from '../interfaces/IState';
import Service from '../services/apiService';
import IMap from '../interfaces/IMap';
import Page from '../enums/page';
import { showPopup } from '../utility';
import store from '.';

export default {
    async loadMaps (context: ActionContext<IState, IState>) {
        const response = await Service.get('/maps');
        const maps =  response.data;
        context.commit('setMaps', maps);
    },
    async saveMap (context: ActionContext<IState, IState>, map: IMap) {
        await Service.post('/maps', {
            data: map
        });
        await context.dispatch('loadMaps');
    },
    async deleteMap(context: ActionContext<IState, IState>, map: IMap) {
        if (map.id) {
            if (context.state.currentMapName === map.name) {
                context.commit('changeMapName', '');
            }
            await Service.delete(`/maps/${map.id}`);
            await context.dispatch('loadMaps');
        }
    },
    async changePage(context: ActionContext<IState, IState>, page: Page) {
        if (context.state.unsavedChanges) {
            try {
                await showPopup({
                    title: 'Unsaved changes',
                    text: 'There are unsaved changes in the current mind map. Are you sure you want to leave?',
                    confirmationText: 'Yes, leave',
                    cancellationText: 'No, stay'
                });
            } catch {
                return;
            }
        }

        context.commit('changePage', page);
    },
    async logout(context: ActionContext<IState, IState>) {
        store.commit('logout');
        store.commit('changePage', Page.MapList);
        store.commit('setMaps', []);
    }
};
