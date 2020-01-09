<template>
    <div class="application-wrapper">
        <MainNav></MainNav>
        <transition name="component-fade" mode="out-in">
            <component :is="page"></component>
        </transition>
        <Popup></Popup>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import MainNav from './MainNav.vue';
import Mapper from './Mapper.vue';
import MapList from './MapList.vue';
import Popup from './Popup.vue';
import IState from '../interfaces/IState';
import Page from '../enums/page';

@Component({
    components: {
        MainNav,
        Mapper,
        MapList,
        Popup
    }
})
export default class Application extends Vue {
    @State((state: IState) => state.page)
    public page!: Page;
}
</script>

<style scoped lang="scss">
.application-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
}

.component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .1s ease;
}
.component-fade-enter, .component-fade-leave-to {
    opacity: 0;
}
</style>
