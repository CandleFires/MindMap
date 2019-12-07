<template>
    <div class="mapper-wrapper">
        <SubNav :saving="saving" @save="save"></SubNav>
        <section ref="mapper" class="mapper">
            <canvas ref="canvas" />
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation, Getter } from 'vuex-class';
import { fabric } from 'fabric';
import SubNav from './SubNav.vue';
import IState from '../interfaces/IState';
import Thought from '../models/thought';
import AddButton from '../models/addButton';
import ThoughtSize from '../enums/thoughtSize';
import IMap from '../interfaces/IMap';

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
    @State((state: IState) => state.currentMapName)
    private mapName!: string;
    @Getter
    private currentMap!: IMap;
    @Mutation
    private changeMapName!: (mapName: string) => void;
    @Mutation
    private saveMap!: (map: IMap) => void;

    private mounted() {
        this.canvas = new fabric.Canvas(this.$refs.canvas as HTMLCanvasElement, {
            preserveObjectStacking: true,
            selection: false
        });
        window.addEventListener('resize', this.resizeCavnas);
        document.addEventListener('keydown', this.handleKeyDown);
        this.resizeCavnas();
        this.loadMap();
    }

    private save() {
        this.saving = true;
        if (!this.mapName) {
            const newName = window.prompt('New Mind Map Name');
            this.changeMapName(newName || '');
        }
        const serializedMap: IMap = {
            name: this.mapName,
            thoughts: this.thoughts.map((thought) => thought.serialize(this.mainThought.getGroup().getCenterPoint()))
        }

        this.saveMap(serializedMap);

        setTimeout(() => this.saving = false, 800);
    }

    private loadMap() {
        if (!this.mapName) {
            this.createEmptyMap();
        } else {
            this.createMapFromSave(this.currentMap);
        }
        const addButton = new AddButton(this.canvas, this.thoughts);
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
