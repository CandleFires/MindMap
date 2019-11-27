<template>
    <header class="navbar is-light" role="navigation">
        <div class="navbar-menu">
            <div class="navbar-start">
                <!-- Current opened mind map -->
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons are-small">
                        <a ref="save" class="button is-success">
                            <span class="icon is-small">
                                <i class="fas fa-save"></i>
                            </span>
                            <span>Save</span>
                        </a>
                        <a ref="share" class="button is-info">
                            <span class="icon is-small">
                                <i class="fas fa-share-square"></i>
                            </span>
                            <span>Share</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import IState from '../interfaces/IState';
import { interactifyNav } from '../utility';

@Component
export default class SubNav extends Vue {
    @Mutation('logout')
    private logout!: () => void;

    private mounted() {
        (this.$refs.save as HTMLElement).addEventListener('click', this.save);
        (this.$refs.share as HTMLElement).addEventListener('click', this.share);
    }

    private beforeDestroyed() {
        (this.$refs.save as HTMLElement).removeEventListener('click', this.save);
        (this.$refs.share as HTMLElement).removeEventListener('click', this.share);
    }

    private share() {
        // Share map
    }

    private save() {
        // Save map
    }
}
</script>

<style scoped lang="scss">
header.navbar {
    min-height: 2.25rem;
    flex: 0 0 auto;
    .navbar-item {
        padding: 0.25rem 0.75rem;
    }
}
</style>
