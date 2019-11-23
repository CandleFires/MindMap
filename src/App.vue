<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <Login v-if="!loggedIn" key="login"></Login>
            <Application v-else key="application"></Application>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Application from './components/Application.vue';
import Login from './components/Login.vue';
import IState from './interfaces/IState';

@Component({
  components: {
    Application,
    Login
  }
})
export default class App extends Vue {
    @State((state: IState) => state.loggedIn)
    public loggedIn!: boolean;
}
</script>

<style lang="scss">
@import './styles/variables.scss';
@import '~bulma/bulma.sass';

html, body {
    height: 100%;
    overflow: auto;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    height: 100%;

    .fade-enter-active, .fade-leave-active {
        transition: opacity .25s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
}
</style>
