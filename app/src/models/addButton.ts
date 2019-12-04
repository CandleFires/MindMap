import { fabric } from 'fabric';
import Thought from './thought';

export default class AddButton {
    private canvas: fabric.Canvas;
    private thoughts: Array<Thought>;
    private button: fabric.Group;
    private hoveredThought: Thought | null = null;

    private readonly CLOSE_THRESHOLD: number = 250;
    private readonly SHOW_THRESHOLD: number = 30;

    constructor(canvas: fabric.Canvas, thoughts: Array<Thought>) {
        this.canvas = canvas;
        this.thoughts = thoughts;

        const button = new fabric.Circle({
            originX: 'center',
            originY: 'center',
            radius: 15,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 1,
            hasControls: false,
            selectable: false
        });
        const verticalLine = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            width: 5,
            height: 20,
            fill: 'white',
            hasControls: false,
            selectable: false
        });
        const horizontalLine = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            width: 20,
            height: 5,
            fill: 'white',
            hasControls: false,
            selectable: false
        });

        this.button = new fabric.Group([
            button,
            verticalLine,
            horizontalLine
        ], {
            originX: 'center',
            originY: 'center',
            left: -100,
            top: -100,
            hasControls: false,
            selectable: false
        });

        this.canvas.add(this.button);
        this.canvas.on('mouse:move', this.changeButtonPosition);
        this.button.on('mouseup', this.createThought);
    }

    public getButton = () => this.button;

    private changeButtonPosition = (event: fabric.IEvent) => {
        let closest: any = null;

        this.thoughts.forEach((thought) => {
            if (thought.getGroup().getCenterPoint().distanceFrom(event.absolutePointer!) <= this.CLOSE_THRESHOLD) {
                const borderPoint = thought.getBorderPointAt(event.absolutePointer!);
                const distance = borderPoint.distanceFrom(event.absolutePointer!);
                if (distance <= this.SHOW_THRESHOLD && (closest === null || closest.distance > distance)) {
                    closest = { point: borderPoint, distance, thought };
                }
            }
        });

        this.hoveredThought = closest ? closest.thought : null;
        this.button.top = closest ? event.absolutePointer!.y : -100;
        this.button.left = closest ? event.absolutePointer!.x : -100;
        this.canvas.bringToFront(this.button);
        this.button.setCoords();
        this.canvas.renderAll();
    }

    private createThought = (event: fabric.IEvent) => {
        if (this.hoveredThought) {
            const {x: tx, y: ty} = this.hoveredThought.getGroup().getCenterPoint();
            const {x: mx, y: my} = event.absolutePointer!;

            const xdiff = mx - tx;
            const ydiff = my - ty;

            const newThought = new Thought(this.canvas, {
                x: tx + (3 * xdiff),
                y: ty + (3 * ydiff),
                width: 200,
                height: 120
            });

            this.thoughts.push(newThought);
            this.canvas.add(newThought.getGroup());
            this.hoveredThought.connectTo(newThought);
        }
    }
}
