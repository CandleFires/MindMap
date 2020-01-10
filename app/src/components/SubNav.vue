<template>
    <header class="navbar is-light" role="navigation">
        <div class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item">
                    <div v-show="!this.nameEdit" class="navbar-item">
                        <span @click="updateEdit">
                            <span v-if="changedName">{{ changedName }}</span>
                            <span v-else-if="mapName">{{ mapName }}</span>
                            <span v-else><em>New Map</em></span>
                        </span>
                        <span v-if="unsavedChanges">*</span>
                    </div>
                    <div class="field has-addons" v-show="this.nameEdit">
                        <div class="control">
                            <input ref="name" class="input is-small" type="text" placeholder="Enter New Name" @keydown="updateNameEnter">
                        </div>
                        <div class="control">
                            <a class="button is-success is-small" @click="updateName">
                                <span class="icon is-small">
                                    <i class="fas fa-check"></i>
                                </span>
                            </a>
                        </div>
                        <div class="control">
                            <a class="button is-danger is-small" @click="cancelUpdate">
                                <span class="icon is-small">
                                    <i class="fas fa-times"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons are-small has-addons">
                        <a class="button is-hidden-desktop" @click="zoomin">
                            <span class="icon is-small">
                                <i class="fas fa-search-plus"></i>
                            </span>
                        </a>
                        <a class="button is-hidden-touch" @click="zoomin">
                            <span class="icon is-small">
                                <i class="fas fa-search-plus"></i>
                            </span>
                            <span>Zoom In</span>
                        </a>
                        <a class="button is-hidden-desktop" @click="zoomout">
                            <span class="icon is-small">
                                <i class="fas fa-search-minus"></i>
                            </span>
                        </a>
                        <a class="button is-hidden-touch" @click="zoomout">
                            <span class="icon is-small">
                                <i class="fas fa-search-minus"></i>
                            </span>
                            <span>Zoom Out</span>
                        </a>
                    </div>
                    <div class="buttons are-small has-addons">
                        <a class="button is-danger is-hidden-desktop" @click="deleteThought">
                            <span class="icon is-small">
                                <i class="fas fa-trash"></i>
                            </span>
                        </a>
                        <a class="button is-danger is-hidden-touch" @click="deleteThought">
                            <span class="icon is-small">
                                <i class="fas fa-trash"></i>
                            </span>
                            <span>Delete</span>
                        </a>
                    </div>
                    <div class="buttons are-small has-addons">
                        <a class="button is-info is-hidden-desktop" @click="share">
                            <span class="icon is-small">
                                <i class="fas fa-share-square"></i>
                            </span>
                        </a>
                        <a class="button is-info is-hidden-touch" @click="share">
                            <span class="icon is-small">
                                <i class="fas fa-share-square"></i>
                            </span>
                            <span>Share</span>
                        </a>
                        <a class="button is-info is-hidden-desktop" @click="saveAsImage">
                            <span class="icon is-small">
                                <i class="fas fa-image"></i>
                            </span>
                        </a>
                        <a class="button is-info is-hidden-touch" @click="saveAsImage">
                            <span class="icon is-small">
                                <i class="fas fa-image"></i>
                            </span>
                            <span>Save Image</span>
                        </a>
                    </div>
                    <div class="buttons are-small">
                        <a class="button is-success is-hidden-desktop" :class="{ 'is-loading': saving }" @click="save">
                            <span class="icon is-small">
                                <i class="fas fa-save"></i>
                            </span>
                        </a>
                        <a class="button is-success is-hidden-touch" :class="{ 'is-loading': saving }" @click="save">
                            <span class="icon is-small">
                                <i class="fas fa-save"></i>
                            </span>
                            <span>Save</span>
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
    @Prop()
    private changedName!: string;
    @State((state: IState) => state.currentMapName)
    private mapName!: string;
    @State((state: IState) => state.unsavedChanges)
    private unsavedChanges!: string;
    private nameEdit: boolean = false;

    @Emit()
    private share() {}

    @Emit()
    private updateEdit() {
        this.nameEdit = true;
        const input = (this.$refs.name as HTMLInputElement);
        input.value = this.changedName || this.mapName || 'New Map';
        setTimeout(() => input.select(), 20);
    }

    @Emit()
    private save() {}

    @Emit()
    private updateName() {
        this.nameEdit = false;
        const name = (this.$refs.name as HTMLInputElement).value;
        return name;
    }

    private cancelUpdate() {
        this.nameEdit = false;
    }

    private updateNameEnter(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.updateName();
        } else if (event.key === 'Escape') {
            this.cancelUpdate();
        }
    }

    @Emit()
    private deleteThought() {}

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
    height: 2.5rem;
    min-height: 2.5rem;
    flex: 0 0 auto;
    .navbar-item {
        padding: 0.25rem 0.75rem;
        .buttons.has-addons {
            margin-bottom: -0.5rem;
            margin-right: 0.5rem;
        }
    }
    .navbar-menu {
        display: flex;
        align-items: stretch;
        flex-grow: 1;
        flex-shrink: 0;
        padding: 0;
        .navbar-start {
            justify-content: flex-start;
            flex: 0 1 auto;
        }
        .navbar-end {
            justify-content: flex-end;
            flex: 1 0 auto;
            display: flex;
        }
        .navbar-item {
            display: flex;
        }
    }
}
</style>
