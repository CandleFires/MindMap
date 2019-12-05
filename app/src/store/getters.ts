import IState from '../interfaces/IState';

export default {
    currentMap: (state: IState) => {
        return state.savedMaps[state.currentMapName];
    }
};
