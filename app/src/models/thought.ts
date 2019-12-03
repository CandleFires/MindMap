import { fabric } from 'fabric';
import IThoughtOptions from '../interfaces/IThoughtOptions';

export default class Thought {
    private canvas: fabric.Canvas;
    private ellipse: fabric.Ellipse;
    private text: fabric.IText;
    private group: fabric.Group;

    constructor(canvas: fabric.Canvas, options: IThoughtOptions) {
        this.canvas = canvas;

        this.ellipse = new fabric.Ellipse({
            originX: 'center',
            originY: 'center',
            left: options.x,
            top: options.y,
            rx: options.width / 2,
            ry: options.height / 2,
            strokeWidth: 1,
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
}