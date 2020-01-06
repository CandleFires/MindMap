import { ActionContext } from 'vuex';
import IState from '../interfaces/IState';
import Service from '../services/apiService';
import IMap from '../interfaces/IMap';

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
    },
    async deleteMap(context: ActionContext<IState, IState>, map: IMap) {
        if (map.id) {
            context.commit('changeMapName', '');
            await Service.delete(`/maps/${map.id}`);
            await context.dispatch('loadMaps');
        }
    }
};
