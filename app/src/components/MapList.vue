<template>
    <section>
        Map List
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import IState from '../interfaces/IState';

@Component
export default class MapList extends Vue {
}
</script>

<style scoped lang="scss">
section {
    flex: 1 1 auto;
}
</style>
