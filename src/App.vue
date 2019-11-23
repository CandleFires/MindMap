<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <Login v-if="!loggedIn" key="login"></Login>
            <HelloWorld v-else key="application"></HelloWorld>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import HelloWorld from './components/HelloWorld.vue';
import Login from './components/Login.vue';
import IState from './interfaces/IState';

@Component({
  components: {
    HelloWorld,
    Login
  }
})
export default class App extends Vue {
    @State((state: IState) => state.loggedIn)
    public loggedIn!: boolean;
}
</script>

<style lang="scss">
@import '~bulma/bulma.sass';

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;

    .fade-enter-active, .fade-leave-active {
        transition: opacity .25s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
}
</style>
