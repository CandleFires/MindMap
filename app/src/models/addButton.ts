import { fabric } from 'fabric';
import Thought from './thought';
import { getSmallerThoughtSize, getObjectZIndex } from '../utility';

export default class AddButton {
    private canvas: fabric.Canvas;
    private thoughts: Array<Thought>;
    private picker: fabric.Group;
    private button: fabric.Group;
    private hoveredThought: Thought | null = null;
    private buttonPressed: boolean = false;
    private pressedThought: Thought | null = null;
    private connectionLine: fabric.Line | null = null;
    private readonly CLOSE_THRESHOLD: number = 250;
    private readonly SHOW_THRESHOLD: number = 30;

    constructor(canvas: fabric.Canvas, thoughts: Array<Thought>, picker: fabric.Group) {
        this.canvas = canvas;
        this.thoughts = thoughts;
        this.picker = picker;

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
        this.canvas.on('mouse:up', this.handleMouseUp);
        this.button.on('mousedown', this.handleMouseDown);
    }

    public getButton = () => this.button;

    private changeButtonPosition = (event: fabric.IEvent) => {
        if (this.picker.containsPoint(event.absolutePointer!, undefined, true)) {
            this.hide();

            return;
        }

        if (this.connectionLine) {
            this.connectionLine.set({
                x2: event.absolutePointer!.x,
                y2: event.absolutePointer!.y
            });
            this.connectionLine.setCoords();
            this.canvas.renderAll();
        }

        let closest: any = null;
        let topmostZ: number = -9001;

        this.thoughts.forEach((thought) => {
            if (thought.getGroup().getCenterPoint().distanceFrom(event.absolutePointer!) <= this.CLOSE_THRESHOLD) {
                const borderPoint = thought.getBorderPointAt(event.absolutePointer!);
                const distance = borderPoint.distanceFrom(event.absolutePointer!);
                const z = getObjectZIndex(this.canvas, thought.getGroup());
                if (distance <= this.SHOW_THRESHOLD) {
                    if (z > topmostZ) {
                        closest = { distance, thought };
                        topmostZ = z;
                    }
                } else if (closest !== null && thought.getGroup().containsPoint(event.absolutePointer!) && z > topmostZ) {
                    closest = null;
                    topmostZ = z;
                }
            }
        });

        if (closest) {
            this.hoveredThought = closest.thought;
            this.button.top = event.absolutePointer!.y;
            this.button.left = event.absolutePointer!.x;
            this.button.opacity = 1;
            this.button.hoverCursor = 'pointer';

            this.canvas.bringToFront(this.button);
            this.button.setCoords();
            this.canvas.renderAll();
        } else {
            this.hide();
        }
    }

    private hide() {
        this.hoveredThought = null;
        this.button.opacity = 0;
        this.button.hoverCursor = 'default';

        this.canvas.sendToBack(this.button);
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
                size: getSmallerThoughtSize(this.hoveredThought.getSize()),
                color: this.hoveredThought.getColor()
            });

            this.thoughts.push(newThought);
            this.canvas.add(newThought.getGroup());
            this.hoveredThought.connectTo(newThought);
        }
    }

    private handleMouseDown = (event: fabric.IEvent) => {
        this.buttonPressed = true;
        this.pressedThought = this.hoveredThought;
        this.connectionLine = new fabric.Line([this.hoveredThought?.getGroup().left!, this.hoveredThought?.getGroup().top!, event.absolutePointer!.x, event.absolutePointer!.y], {
            stroke: 'gray',
            strokeWidth: 3,
            selectable: false,
            hasControls: false,
            hasBorders: false,
            evented: false,
            centeredRotation: false,
            centeredScaling: false,
            name: 'temp_connection',
            hoverCursor: 'default'
        });
        this.canvas.sendToBack(this.connectionLine);
        this.canvas.renderAll();
    }
    
    private handleMouseUp = (event: fabric.IEvent) => {
        if (this.buttonPressed) {
            this.buttonPressed = false;
            if (event.target === this.button && this.pressedThought === this.hoveredThought) {
                this.createThought(event);
                if (this.connectionLine) {
                    this.canvas.remove(this.connectionLine);
                    this.connectionLine = null;
                }
            } else if (event.target) {
                let targetThought: Thought | undefined;
                if (event.target === this.button) {
                    targetThought = this.hoveredThought!;
                } else {
                    targetThought = this.thoughts.find((thought) => thought.getGroup() === event.target);
                }

                if (targetThought && targetThought !== this.pressedThought && !targetThought?.connections.find((connection) => connection.contains(this.pressedThought!))) {
                    this.pressedThought?.connectTo(targetThought);
                }

                if (this.connectionLine) {
                    this.canvas.remove(this.connectionLine);
                    this.connectionLine = null;
                }
            } else if (this.connectionLine) {
                this.canvas.remove(this.connectionLine);
                this.connectionLine = null;
            }
        }
    }
}
