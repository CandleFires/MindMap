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
        this.canvas.add(this.bubbleAt(center.left, center.top, 200, 100));
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

    private bubbleAt(x: number, y: number, width: number, height: number): fabric.Group {
        let ellipse = new fabric.Ellipse({
            originX: 'center',
            originY: 'center',
            left: x,
            top: y,
            rx: width / 2,
            ry: height / 2,
            strokeWidth: 1,
            stroke: '#55828b',
            fill: '#fefefe',
            hasControls: false
        });
        let text = new fabric.IText('New thought', {
            originX: 'center',
            originY: 'center',
            left: x,
            top: y,
            fontFamily: 'Helvetica',
            fontSize: 20
        });

        const createGroup = () => {
            const group = new fabric.Group([ellipse, text], {
                originX: 'center',
                originY: 'center',
                hasControls: false,
                subTargetCheck: true
            });

            group.on('mousedblclick', (e) => {
                group._restoreObjectsState();
                this.canvas.remove(group);
                this.canvas.renderAll();
                this.canvas.add(ellipse);
                this.canvas.add(text);
                this.canvas.setActiveObject(text);
                text.enterEditing();
                text.selectAll();
            });

            return group;
        }

        text.on('editing:exited', () => {
            this.canvas.remove(ellipse);
            this.canvas.remove(text);
            const group = createGroup();
            this.canvas.add(group);
            this.canvas.setActiveObject(group);
        });

        // Disables weird fabric.js bug with bubble movement.
        ellipse.on('moving', () => {
            ellipse.left = text.left;
            ellipse.top = text.top;
            this.canvas.discardActiveObject();
        });

        return createGroup();
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
