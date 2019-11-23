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
                <a class="navbar-item">
                    My Mind Maps
                </a>
                <a class="navbar-item">
                    Create a Mind Map
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import IState from '../interfaces/IState';
import { interactifyNav } from '@/utility';

@Component
export default class MainNav extends Vue {
    @State((state: IState) => state.user)
    public user!: string;
    @Mutation('logout')
    private logout!: () => void;

    private mounted() {
        interactifyNav();
        (this.$refs.logout as HTMLButtonElement).addEventListener('click', this.logout);
    }

    private beforeDestroyed() {
        (this.$refs.logout as HTMLButtonElement).removeEventListener('click', this.logout);
    }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

nav {
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
}
</style>
