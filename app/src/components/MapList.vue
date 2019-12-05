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
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import IState from '../interfaces/IState';
import apiService from '../services/apiService';
import IDictionary from '../interfaces/IDictionary';
import IMap from '../interfaces/IMap';
import Page from '../enums/page';

@Component
export default class MapList extends Vue {
    @State((state: IState) => state.savedMaps)
    private savedMaps!: IDictionary<IMap>;
    @Mutation
    private deleteMap!: (map: IMap) => void;
    @Mutation
    private changeMapName!: (mapName: string) => void;
    @Mutation
    private changePage!: (page: Page) => void;

    private loadMap(map: IMap) {
        this.changeMapName(map.name);
        this.changePage(Page.Mapper);
    }

    private shareMap(map: IMap) {
        // TODO: Share
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
        tbody tr {
            border: 1px solid #dbdbdb;
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
