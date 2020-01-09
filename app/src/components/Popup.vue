<template>
    <div class="modal" :class="{ 'is-active': shown }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ title }}</p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <p>{{ text }}</p>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success is-small" @click="ok">{{ confirmationText }}</button>
                <button class="button is-small" @click="close">{{ cancellationText }}</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import IState from '../interfaces/IState';

@Component
export default class Login extends Vue {
    @Mutation('updatePopupStatus')
    private updatePopupStatus!: (result: 'good' | 'bad') => void;
    @State((state: IState) => state.popup.shown)
    private shown!: boolean;
    @State((state: IState) => state.popup.title)
    private title!: string;
    @State((state: IState) => state.popup.text)
    private text!: string;
    @State((state: IState) => state.popup.confirmationText)
    private confirmationText!: string;
    @State((state: IState) => state.popup.cancellationText)
    private cancellationText!: string;

    private close() {
        this.updatePopupStatus('bad');
    }

    private ok() {
        this.updatePopupStatus('good');
    }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.modal .modal-card {
    .modal-card-head.modal-card-title {
        margin-left: 20px;
    }
    .modal-card-foot {
        justify-content: flex-end;
    }
}

</style>
