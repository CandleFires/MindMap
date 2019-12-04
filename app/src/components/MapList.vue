<template>
    <section class="map-list">
        <table class="table is-hoverable is-fullwidth">
            <thead>
                <tr>
                    <th>Name</th>
                    <th class="actions">Actions</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th></th>
                    <th class="buttons are-small is-right">
                        <a ref="save" class="button is-primary" @click="newMap(map)">
                            <span class="icon is-small">
                                <i class="fas fa-plus"></i>
                            </span>
                            <span>New Map</span>
                        </a>
                    </th>
                </tr>
            </tfoot>
            <tbody>
                <tr v-for="map in savedMaps" :key="map.name">
                    <td>
                        {{ map.name }}
                    </td>
                    <td class="buttons are-small is-right">
                        <a ref="save" class="button is-primary" @click="loadMap(map)">
                            <span class="icon is-small">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span>Load</span>
                        </a>
                        <a ref="share" class="button is-info" @click="shareMap(map)">
                            <span class="icon is-small">
                                <i class="fas fa-share-square"></i>
                            </span>
                            <span>Share</span>
                        </a>
                        <a ref="share" class="button is-danger" @click="deleteMap(map)">
                            <span class="icon is-small">
                                <i class="fas fa-ban"></i>
                            </span>
                            <span>Delete</span>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import IState from '../interfaces/IState';
import apiService from '../services/apiService';
import IDictionary from '../interfaces/IDictionary';
import IMap from '../interfaces/IMap';

@Component
export default class MapList extends Vue {
    @State((state: IState) => state.savedMaps)
    private savedMaps!: IDictionary<IMap>;

    private loadMap(map: IMap) {

    }

    private shareMap(map: IMap) {

    }

    private deleteMap(map: IMap) {

    }
}
</script>

<style scoped lang="scss">
section {
    flex: 1 1 auto;
}
</style>
