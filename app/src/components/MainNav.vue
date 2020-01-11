<template>
    <nav class="navbar is-primary" role="navigation">
        <div class="navbar-brand">
            <span class="navbar-item">
                <img src="images/CandleFire.png" alt="CandleFire">
            </span>
            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar-content">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="navbar-content" class="navbar-menu">
            <div class="navbar-start">
                <a ref="maps" class="navbar-item" :class="{ active: page === 'MapList' }">
                    My Mind Maps
                </a>
                <a ref="create" class="navbar-item" :class="{ active: page === 'Mapper' }">
                    Map Editor
                </a>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <span class="logged-in is-hidden-touch">
                        Logged in as {{ user }}
                    </span>
                    <div class="buttons">
                        <a ref="logout" class="button is-danger">
                            Log Out<span class="logged-in is-hidden-desktop">{{ user }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation, Action } from 'vuex-class';
import IState from '../interfaces/IState';
import { interactifyNav } from '../utility';
import Page from '../enums/page';

@Component
export default class MainNav extends Vue {
    @State((state: IState) => state.user)
    public user!: string;
    @State((state: IState) => state.page)
    public page!: Page;
    @Mutation('logout')
    private logout!: () => void;
    @Action('changePage')
    private changePage!: (page: Page) => void;

    private mounted() {
        interactifyNav();
        (this.$refs.logout as HTMLElement).addEventListener('click', this.logout);
        (this.$refs.create as HTMLElement).addEventListener('click', this.switchToCreate);
        (this.$refs.maps as HTMLElement).addEventListener('click', this.switchToMyMaps);
    }

    private beforeDestroyed() {
        (this.$refs.logout as HTMLElement).removeEventListener('click', this.logout);
        (this.$refs.create as HTMLElement).removeEventListener('click', this.switchToCreate);
        (this.$refs.maps as HTMLElement).removeEventListener('click', this.switchToMyMaps);
    }

    private switchToMyMaps() {
        this.changePage(Page.MapList);
    }

    private switchToCreate() {
        this.changePage(Page.Mapper);
    }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

nav {
    flex: 0 0 auto;
    img {
        -webkit-filter: drop-shadow(1px 1px 0 $text-color)
                drop-shadow(-1px 1px 0 $text-color)
                drop-shadow(1px -1px 0 $text-color)
                drop-shadow(-1px -1px 0 $text-color);
        filter: drop-shadow(1px 1px 0 $text-color)
                drop-shadow(-1px 1px 0 $text-color)
                drop-shadow(1px -1px 0 $text-color)
                drop-shadow(-1px -1px 0 $text-color);
    }
    .logged-in {
        margin-right: 1em;
        &.is-hidden-desktop {
            margin-left: 0.333em;
            margin-right: 0;
        }
    }
    .buttons {
        justify-content: center;
    }
    .navbar-item.active {
        background-color: darken($color: $primary, $amount: 10);
    }
}
</style>
