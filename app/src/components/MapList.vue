<template>
    <section>

    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import IState from '../interfaces/IState';
import apiService from '../services/apiService';

@Component
export default class MapList extends Vue {
    private mounted() {

    }
}
</script>

<style scoped lang="scss">
section {
    flex: 1 1 auto;
}
</style>
