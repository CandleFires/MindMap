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
                        <a ref="save" class="button is-primary" @click="newMap">
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
                <tr v-if="Object.entries(savedMaps).length === 0">
                    <td colspan="2">
                        <em>No saved maps</em>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation, Action } from 'vuex-class';
import IState from '../interfaces/IState';
import apiService from '../services/apiService';
import IDictionary from '../interfaces/IDictionary';
import IMap from '../interfaces/IMap';
import Page from '../enums/page';
import Service from '../services/apiService';
import { saveAs } from 'file-saver';

@Component
export default class MapList extends Vue {
    @State((state: IState) => state.savedMaps)
    private savedMaps!: IDictionary<IMap>;
    @Action
    private deleteMap!: (map: IMap) => void;
    @Mutation
    private changeMapName!: (mapName: string) => void;
    @Action
    private changePage!: (page: Page) => void;
    @Action
    private loadMaps!: () => Promise<void>;

    private mounted() {
        this.loadMaps();
    }

    private loadMap(map: IMap) {
        this.changeMapName(map.name);
        this.changePage(Page.Mapper);
    }

    private shareMap (map: IMap) {
      const json = JSON.stringify(map);
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, `${map.name}.json`);
    }

    private newMap(map: IMap) {
        this.changeMapName('');
        this.changePage(Page.Mapper);
    }
}
</script>

<style scoped lang="scss">

section {
    flex: 1 1 auto;
    .buttons .button {
        margin-bottom: 0;
    }
    table.table {
        max-width: 1200px;
        margin: auto;
        tbody tr {
            border: 1px solid #dbdbdb;
            border-left: 0;
            border-right: 0;
            td, th {
                border: 0;
                height: 46px;
                vertical-align: middle;
            }
        }
        tfoot, thead {
            td, th {
                border: 0;
                &.actions {
                    text-align: right;
                }
            }
        }
    }
}
</style>
