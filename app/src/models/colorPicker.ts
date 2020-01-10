import { fabric } from 'fabric';
import Thought from './thought';

export default class ColorPicker {
    private canvas: fabric.Canvas;
    private thoughts: Array<Thought>;
    private picker: fabric.Group;
    private colorButtons: Array<fabric.Circle>;
    private thoughtMoveCallback?: () => void;
    private selectedThought: Thought | undefined;
    private clearTimeout: number | undefined;

    private readonly BUBBLE_SIZE: number = 12;
    private readonly BUBBLE_OFFSET: number = 30;

    constructor(canvas: fabric.Canvas, thoughts: Array<Thought>) {
        this.canvas = canvas;
        this.thoughts = thoughts;
        const colors = [
            '#0074D9',
            '#39CCCC',
            '#2ECC40',
            '#FFDC00',
            '#FF851B',
            '#FF4136',
            '#F012BE',
            '#B10DC9',
        ];

        this.colorButtons = colors.map((color, i) => {
            const colorButton = new fabric.Circle({
                originX: 'center',
                originY: 'center',
                radius: this.BUBBLE_SIZE,
                fill: color,
                stroke: 'black',
                strokeWidth: 1,
                hasControls: false,
                selectable: false,
                hoverCursor: 'default',
                top: ((i % 4) - 2) * this.BUBBLE_OFFSET,
                left: 0 + (this.BUBBLE_OFFSET * Math.floor(i / 4))
            });

            colorButton.on('mousedown', () => this.colorChosen(color));

            return colorButton;
        });

        this.picker = new fabric.Group(this.colorButtons, {
            originX: 'left',
            originY: 'center',
            left: -100,
            top: -100,
            hasControls: false,
            selectable: false,
            subTargetCheck: true,
            opacity: 0,
            hoverCursor: 'default',
            name: 'picker'
        });

        this.canvas.add(this.picker);
        this.canvas.on({
            'selection:created': this.changePickerPosition,
            'selection:updated': this.changePickerPosition,
            'selection:cleared': (e: fabric.IEvent) => {
                this.clearTimeout = setTimeout(() => this.changePickerPosition(e), 20) // Have to delay deselection to keep selected thought for click handling
            }
        });
    }

    public getPicker = () => this.picker;

    private changePickerPosition = (event: fabric.IEvent) => {
        clearTimeout(this.clearTimeout);
        let targetThought;

        if (event.target) {
            targetThought = this.thoughts.find((thought) => thought.getGroup() === event.target);
        }
        if (targetThought) {
            if (this.selectedThought !== targetThought) {
                this.selectedThought = targetThought;
                this.colorButtons.forEach((colorButton) => colorButton.hoverCursor = 'pointer');
                this.picker.opacity = 1;
                this.canvas.bringToFront(this.picker);
                this.movePickerTo(targetThought);
                this.thoughtMoveCallback = this.movePickerTo.bind(this, targetThought);
                targetThought.onThoughtMove(this.thoughtMoveCallback);
            }
        } else {
            if (this.thoughtMoveCallback) {
                this.thoughts.forEach((thought) => thought.offThoughtMove(this.thoughtMoveCallback!));
                delete this.thoughtMoveCallback;
            }
            this.picker.opacity = 0;
            this.selectedThought = undefined;
            this.colorButtons.forEach((colorButton) => colorButton.hoverCursor = 'default');
            this.picker.setCoords();
            this.canvas.renderAll();
        }
    }

    private movePickerTo = (thought: Thought) => {
        const thoughtObject = thought.getGroup();
        this.picker.left = thoughtObject.left! + (thoughtObject.width! / 2);
        this.picker.top = thoughtObject.top;
        this.picker.setCoords();
        this.canvas.renderAll();
    }

    private colorChosen = (color: string) => {
        if (this.selectedThought) {
            this.selectedThought.changeColor(color);
            this.canvas.setActiveObject(this.selectedThought.getGroup());
        }
    }
}
