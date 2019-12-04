import { fabric } from 'fabric';
import Thought from './thought';

export default class Connection {
    private canvas: fabric.Canvas;
    private thought1: Thought;
    private thought2: Thought;
    private line: fabric.Line;

    constructor(canvas: fabric.Canvas, thought1: Thought, thought2: Thought) {
        this.canvas = canvas;
        this.thought1 = thought1;
        this.thought2 = thought2;

        const {x: x1, y: y1} = this.thought1.getGroup().getCenterPoint();
        const {x: x2, y: y2} = this.thought2.getGroup().getCenterPoint();
        this.line = new fabric.Line([x1, y1, x2, y2], {
            stroke: 'black',
            strokeWidth: 3,
            selectable: false,
            hasControls: false,
            hasBorders: false,
            centeredRotation: false,
            centeredScaling: false
        });
        this.canvas.add(this.line);
        this.render();

        this.thought1.onThoughtMove(this.changeFirstPosition);
        this.thought2.onThoughtMove(this.changeSecondPosition);
    }

    private changeFirstPosition = () => {
        const {x, y} = this.thought1.getGroup().getCenterPoint();
        this.line.set({
            x1: x,
            y1: y
        });
        this.render();
    }

    private changeSecondPosition = () => {
        const {x, y} = this.thought2.getGroup().getCenterPoint();
        this.line.set({
            x2: x,
            y2: y
        });
        this.render();
    }

    private render = () => {
        this.line.sendToBack();
        this.line.setCoords();
        this.canvas.renderAll();
    }
}
