<template>
    <div>
        <MainNav></MainNav>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import MainNav from './MainNav.vue';
import IState from '../interfaces/IState';

@Component({
    components: {
        MainNav
    }
})
export default class Application extends Vue {
    @State((state: IState) => state.user)
    public user!: string;
}
</script>

<style scoped lang="scss">

</style>
