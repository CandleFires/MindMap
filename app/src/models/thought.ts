import { fabric } from 'fabric';
import IThoughtOptions from '../interfaces/IThoughtOptions';

export default class Thought {
    private canvas: fabric.Canvas;
    private ellipse: fabric.Ellipse;
    private text: fabric.IText;
    private group: fabric.Group;
    private addButton: fabric.Group;

    constructor(canvas: fabric.Canvas, options: IThoughtOptions) {
        this.canvas = canvas;

        this.ellipse = new fabric.Ellipse({
            originX: 'center',
            originY: 'center',
            left: options.x,
            top: options.y,
            rx: options.width / 2,
            ry: options.height / 2,
            strokeWidth: 3,
            stroke: options.color || '#55828b',
            fill: '#fefefe',
            hasControls: false
        });
        this.ellipse.on('moving', this.preventEllipseMovement);

        this.text = new fabric.IText('New thought', {
            originX: 'center',
            originY: 'center',
            left: options.x,
            top: options.y,
            fontFamily: 'Helvetica',
            fontSize: 20
        });
        this.text.on('editing:exited', this.onEditExit);

        this.group = this.createGroup();
        this.canvas.add(this.group);
        this.addButton = this.createAddButton();
        this.canvas.add(this.addButton);
    }

    public createAddButton = () => {
        const button = new fabric.Circle({
            originX: 'center',
            originY: 'center',
            radius: 15,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 1
        });
        const verticalLine = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            width: 5,
            height: 20,
            fill: 'white'
        });
        const horizontalLine = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            width: 20,
            height: 5,
            fill: 'white'
        });
        return new fabric.Group([
            button,
            verticalLine,
            horizontalLine
        ], {
            originX: 'center',
            originY: 'center',
            left: -100,
            top: -100
        });
    }

    public getGroup = () => this.group;

    private createGroup = () => {
        const group = new fabric.Group([this.ellipse, this.text], {
            originX: 'center',
            originY: 'center',
            hasControls: false,
            subTargetCheck: true
        });

        group.on('mousedblclick', this.onGroupDoubleClick);
        group.on('mousemove', this.onMouseOver);
        group.on('mouseout', this.onMouseOut);

        return group;
    }

    private onGroupDoubleClick = () => {
        this.group._restoreObjectsState();
        this.canvas.remove(this.group);
        this.canvas.renderAll();
        this.canvas.add(this.ellipse);
        this.canvas.add(this.text);
        this.canvas.setActiveObject(this.text);
        this.text.enterEditing();
        this.text.selectAll();
    }

    private onEditExit = () => {
        this.canvas.remove(this.ellipse);
        this.canvas.remove(this.text);
        this.group = this.createGroup();
        this.canvas.add(this.group);
        this.canvas.setActiveObject(this.group);
    }

    private preventEllipseMovement = () => {
        this.ellipse.left = this.text.left;
        this.ellipse.top = this.text.top;
        this.canvas.discardActiveObject();
    }

    private onMouseOver = (event: fabric.IEvent) => {
        const {x, y} = this.group.getCenterPoint();
        const angle = Math.atan2(y - event.absolutePointer?.y!, event.absolutePointer?.x! - x);
        const epx = x + (this.ellipse.getRx() * Math.cos(angle));
        const epy = y + (this.ellipse.getRy() * -Math.sin(angle));

        this.addButton.top = epy;
        this.addButton.left = epx;
        this.canvas.bringToFront(this.addButton);
        this.addButton.setCoords();
        this.canvas.renderAll();
    }

    private onMouseOut = () => {
        this.addButton.top = -100;
        this.addButton.left = -100;
        this.addButton.setCoords();
        this.canvas.renderAll();
    }
}