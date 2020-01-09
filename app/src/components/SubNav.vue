<template>
    <header class="navbar is-light" role="navigation">
        <div class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item">
                    <span v-if="mapName">{{ mapName }}</span>
                    <span v-else><em>New Map</em></span>
                    <span v-if="unsavedChanges">*</span>
                </div>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons are-small has-addons">
                        <a class="button" @click="zoomin">
                            <span class="icon is-small">
                                <i class="fas fa-search-plus"></i>
                            </span>
                        </a>
                        <a class="button" @click="zoomout">
                            <span class="icon is-small">
                                <i class="fas fa-search-minus"></i>
                            </span>
                        </a>
                    </div>
                    <div class="buttons are-small">
                        <a class="button is-success" :class="{ 'is-loading': saving }" @click="save">
                            <span class="icon is-small">
                                <i class="fas fa-save"></i>
                            </span>
                            <span>Save</span>
                        </a>
                        <a class="button is-info" @click="share">
                            <span class="icon is-small">
                                <i class="fas fa-share-square"></i>
                            </span>
                            <span>Share</span>
                        </a>
                        <a class="button is-info" @click="saveAsImage">
                            <span class="icon is-small">
                                <i class="fas fa-image"></i>
                            </span>
                            <span>Save As Image</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import IState from '../interfaces/IState';
import { interactifyNav } from '../utility';

@Component
export default class SubNav extends Vue {
    @Prop()
    private saving!: boolean;
    @State((state: IState) => state.currentMapName)
    private mapName!: string;
    @State((state: IState) => state.unsavedChanges)
    private unsavedChanges!: string;

    @Emit()
    private share() {}

    @Emit()
    private save() {}

    @Emit()
    private saveAsImage() {}

    @Emit()
    private zoomin() {}

    @Emit()
    private zoomout() {}
}
</script>

<style scoped lang="scss">
header.navbar {
    min-height: 2.25rem;
    flex: 0 0 auto;
    .navbar-item {
        padding: 0.25rem 0.75rem;
        .buttons.has-addons {
            margin-bottom: -0.5rem;
            margin-right: 0.5rem;
        }
    }
}
</style>
