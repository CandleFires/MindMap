<template>
    <div class="mapper-wrapper">
        <SubNav :saving="saving" @save="save" @delete-thought="deleteThought" @save-as-image="saveAsImage" @share="share" @zoomin="changeZoom(true)" @zoomout="changeZoom(false)"></SubNav>
        <section ref="mapper" class="mapper">
            <canvas ref="canvas" />
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation, Getter, Action } from 'vuex-class';
import { fabric } from 'fabric';
import { setDocumentTitle } from '../utility';
import SubNav from './SubNav.vue';
import IState from '../interfaces/IState';
import Thought from '../models/thought';
import AddButton from '../models/addButton';
import ColorPicker from '../models/colorPicker';
import ThoughtSize from '../enums/thoughtSize';
import IMap from '../interfaces/IMap';
import {saveAs} from "file-saver";

@Component({
    components: {
        SubNav
    }
})
export default class Application extends Vue {
    private canvas!: fabric.Canvas;
    private thoughts: Array<Thought> = [];
    private mainThought!: Thought;
    private saving: boolean = false;
    private panning: boolean = false;
    private lastCursorPosition: fabric.Point | undefined;
    private zoomLevels = [0.1, 0.17, 0.25, 0.5, 0.7, 1, 1.5, 2.25, 3.15, 4.6, 6];
    private zoomI = 5;
    @State((state: IState) => state.currentMapName)
    private mapName!: string;
    @State((state: IState) => state.unsavedChanges)
    private unsavedChanges!: string;
    @Getter
    private currentMap!: IMap;
    @Mutation
    private changeMapName!: (mapName: string) => void;
    @Mutation
    private isUnsaved!: () => void;
    @Mutation
    private isSaved!: () => void;
    @Action
    private saveMap!: (map: IMap) => void;

    private mounted() {
        this.canvas = new fabric.Canvas(this.$refs.canvas as HTMLCanvasElement, {
            preserveObjectStacking: true,
            selection: false
        });
        window.addEventListener('resize', this.resizeCavnas);
        document.addEventListener('keydown', this.handleKeyDown);
        this.canvas.on('mouse:down', this.handleMouseDown);
        this.canvas.on('mouse:up', this.handleMouseUp);
        this.canvas.on('mouse:move', this.handleMouseMove);
        this.canvas.on('mouse:wheel', this.handleMouseWheel);
        this.resizeCavnas();
        this.loadMap();
    }

    private async save() {
        this.saving = true;
        if (!this.mapName) {
            const newName = window.prompt('New Mind Map Name');
            this.changeMapName(newName || '');
        }
        const serializedMap: IMap = {
            name: this.mapName,
            thoughts: this.thoughts.map((thought) => thought.serialize(this.mainThought.getGroup().getCenterPoint()))
        };

        await this.saveMap(serializedMap);
        this.isSaved();

        this.saving = false;
    }

    private deleteThought() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'group') {
            const thought = this.thoughts.find((th) => th.getGroup() === activeObject);
            if (thought && thought !== this.mainThought) {
                this.thoughts.splice(this.thoughts.indexOf(thought), 1);
                thought.destroy();
                this.canvas.remove(activeObject);
                this.canvas.discardActiveObject().renderAll();
            }
        }
    }

    private share() {
        const serializedMap: IMap = {
            name: this.mapName,
            thoughts: this.thoughts.map((thought) => thought.serialize(this.mainThought.getGroup().getCenterPoint()))
        };
        const json = JSON.stringify(serializedMap);
        const blob = new Blob([json], { type: 'application/json' });
        saveAs(blob, `${serializedMap.name}.json`);
    }

    private saveAsImage() {
        const image = this.canvas.toDataURL({
            format: 'png'
        });
        saveAs(image, `${this.mapName}.png`);
    }

    private changeZoom(zoomIn: boolean) {
        this.zoomI += (zoomIn ? 1 : -1);
        if (this.zoomI < 0) {
            this.zoomI = 0;
        } else if (this.zoomI >= this.zoomLevels.length) {
            this.zoomI = this.zoomLevels.length - 1;
        }
        const center = this.canvas.getCenter();
        this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), this.zoomLevels[this.zoomI]);
    }

    private loadMap() {
        if (!this.mapName) {
            this.createEmptyMap();
            setDocumentTitle('New Mind Map');
        } else {
            this.createMapFromSave(this.currentMap);
            setDocumentTitle(this.mapName);
        }
        const colorPicker = new ColorPicker(this.canvas, this.thoughts);
        const addButton = new AddButton(this.canvas, this.thoughts, colorPicker.getPicker());
        this.canvas.renderAll();
    }

    private createEmptyMap() {
        const center = this.canvas.getCenter();
        this.mainThought = new Thought(this.canvas, {
            x: center.left,
            y: center.top,
            size: ThoughtSize.Main
        });
        this.thoughts.push(this.mainThought);
        this.canvas.add(this.mainThought.getGroup());
    }

    private createMapFromSave(map: IMap) {
        const center = this.canvas.getCenter();
        map.thoughts.forEach((thought) => {
            const newThought = new Thought(this.canvas, {
                x: center.left + thought.x,
                y: center.top + thought.y,
                id: thought.id,
                size: thought.size,
                text: thought.text
            });
            this.thoughts.push(newThought);
            if (newThought.getSize() === ThoughtSize.Main) {
                this.mainThought = newThought;
            }
            thought.connections.forEach((connection) => {
                const loadedThought = this.thoughts.find((th) => th.getId() === connection);
                if (loadedThought) {
                    newThought.connectTo(loadedThought);
                }
            });
        });
    }

    private beforeDestroy() {
        window.removeEventListener('resize', this.resizeCavnas);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    private resizeCavnas() {
        const container = this.$refs.mapper as HTMLElement;
        this.canvas.setWidth(window.innerWidth);
        this.canvas.setHeight(container.clientHeight);
        this.canvas.calcOffset();
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'group') {
                const thought = this.thoughts.find((th) => th.getGroup() === activeObject);
                if (thought && thought !== this.mainThought) {
                    this.thoughts.splice(this.thoughts.indexOf(thought), 1);
                    thought.destroy();
                    this.canvas.remove(activeObject);
                    this.canvas.discardActiveObject().renderAll();
                }
            }
        }
    }

    private handleMouseDown(event: fabric.IEvent) {
        if (!event.target || event.target.name === 'connection') {
            this.panning = true;
        }
        if (!this.unsavedChanges) {
            this.isUnsaved();
            console.warn(this.unsavedChanges);
        }
    }

    private handleMouseUp(event: fabric.IEvent) {
        this.panning = false;
        delete this.lastCursorPosition;
    }

    private handleMouseMove(event: fabric.IEvent) {
        if (this.panning) {
            if (this.lastCursorPosition) {
                const moveY = (event.pointer!.y - this.lastCursorPosition!.y) / this.zoomLevels[this.zoomI];
                const moveX = (event.pointer!.x - this.lastCursorPosition!.x) / this.zoomLevels[this.zoomI];
                this.thoughts.forEach((thought) => thought.moveBy(moveX, moveY));
            }
            this.lastCursorPosition = event.pointer;
        }
    }

    private handleMouseWheel(event: fabric.IEvent) {
        if ((event.e as MouseWheelEvent).deltaY) {
            this.changeZoom((event.e as MouseWheelEvent).deltaY < 0);
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
