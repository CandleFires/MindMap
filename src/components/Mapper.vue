<template>
    <div>
        <SubNav></SubNav>
        <section class="mapper">
            <canvas></canvas>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import SubNav from './SubNav.vue';
import IState from '../interfaces/IState';

@Component({
    components: {
        SubNav
    }
})
export default class Application extends Vue {

}
</script>

<style scoped lang="scss">
.mapper {
    flex: 1 1 auto;
}
</style>
