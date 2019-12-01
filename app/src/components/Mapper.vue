<template>
    <div class="mapper-wrapper">
        <SubNav></SubNav>
        <section ref="mapper" class="mapper">
            <canvas ref="canvas" width=800 height=600 resize />
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import SubNav from './SubNav.vue';
import IState from '../interfaces/IState';
import paper, { Size } from 'paper';

@Component({
    components: {
        SubNav
    }
})
export default class Application extends Vue {
    private canvas!: HTMLCanvasElement;

    private mounted() {
        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        paper.setup(this.canvas);
        window.addEventListener('resize', this.resizeCavnas);
        this.resizeCavnas();
    }

    private beforeDestroy() {
        window.removeEventListener('resize', this.resizeCavnas);
    }

    private resizeCavnas() {
        let navbarsSize = 0;
        document.querySelectorAll('.navbar').forEach((navbar) => navbarsSize += navbar.clientHeight);
        const canvasHeight = window.innerHeight - navbarsSize;
        paper.view.viewSize!.width = window.outerWidth;
        paper.view.viewSize!.height = canvasHeight;
    }
}
</script>

<style scoped lang="scss">
.mapper-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .mapper {
        flex: 1 1 auto;
        canvas {
            width: 100%;
        }
    }
}
</style>
