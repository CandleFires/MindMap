<template>
    <div class="mapper-wrapper">
        <SubNav></SubNav>
        <section ref="mapper" class="mapper">
            <canvas ref="canvas" />
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import SubNav from './SubNav.vue';
import IState from '../interfaces/IState';
import { fabric } from 'fabric';

@Component({
    components: {
        SubNav
    }
})
export default class Application extends Vue {
    private canvas!: fabric.Canvas;

    private mounted() {
        this.canvas = new fabric.Canvas(this.$refs.canvas as HTMLCanvasElement);
        window.addEventListener('resize', this.resizeCavnas);
        this.resizeCavnas();
        this.loadMap();
    }

    private loadMap() {
        const center = this.canvas.getCenter();
        this.canvas.add(this.ellipseAt(center.left, center.top, 200, 140));
        this.canvas.renderAll();
    }

    private beforeDestroy() {
        window.removeEventListener('resize', this.resizeCavnas);
    }

    private resizeCavnas() {
        const container = this.$refs.mapper as HTMLElement;
        this.canvas.setWidth(window.innerWidth);
        this.canvas.setHeight(container.clientHeight);
        this.canvas.calcOffset();
    }

    private ellipseAt(x: number, y: number, width: number, height: number): fabric.Ellipse {
        console.warn(`creating ellipse at ${x} ${y} - ${width} ${height}`);
        return new fabric.Ellipse({
            originX: 'center',
            originY: 'center',
            left: x,
            top: y,
            rx: width / 2,
            ry: height / 2,
            strokeWidth: 1,
            stroke: 'black',
            fill: 'red',
            hasControls: false
        });
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
        width: 100%;
        canvas {
            width: 100%;
        }
    }
}
</style>
