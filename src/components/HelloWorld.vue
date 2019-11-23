<template>
    <div class="hello">
        Hello {{ user }}
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import IState from '../interfaces/IState';

@Component
export default class HelloWorld extends Vue {
    @State((state: IState) => state.user)
    public user!: string;
}
</script>

<style scoped lang="scss">

</style>
