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
import { fabric } from 'fabric';
import SubNav from './SubNav.vue';
import IState from '../interfaces/IState';
import Thought from '../models/thought';

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
        this.canvas.add(new Thought(this.canvas, {
            x: center.left,
            y: center.top,
            width: 200,
            height: 120
        }).getGroup());
        this.canvas.renderAll();

        this.canvas.on('object:moving', (e) => {
            console.warn((e.target as fabric.Object).type);
        });
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

    private fabricDblClick(obj: any, handler: (obj: fabric.Object) => void) {
        return () => {
            if (obj.clicked) handler(obj);
            else {
                obj.clicked = true;
                setTimeout(function () {
                    obj.clicked = false;
                }, 500);
            }
        };
    }

    private ungroup(group: fabric.Group) {
        const items = group._objects;
        group._restoreObjectsState();
        this.canvas.remove(group);
        this.canvas.renderAll();
        for (var i = 0; i < items.length; i++) {
            this.canvas.add(items[i]);
        }
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
