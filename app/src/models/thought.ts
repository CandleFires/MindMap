import { fabric } from 'fabric';
import IThoughtOptions from '../interfaces/IThoughtOptions';
import Connection from './connection';

export default class Thought {
    public connections: Array<Connection>;

    private canvas: fabric.Canvas;
    private ellipse: fabric.Ellipse;
    private text: fabric.IText;
    private group: fabric.Group;
    private moveCallbacks: Array<() => void>;

    constructor(canvas: fabric.Canvas, options: IThoughtOptions) {
        this.canvas = canvas;
        this.connections = [];
        this.moveCallbacks = [];

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
    }

    public connectTo = (otherThought: Thought) => {
        const connection = new Connection(this.canvas, this, otherThought);
        this.addConnection(connection);
        otherThought.addConnection(connection);
    }

    public addConnection = (connection: Connection) => {
        this.connections.push(connection);
    }

    public getGroup = () => this.group;

    public getBorderPointAt = (point: fabric.Point) => {
        const {x, y} = this.group.getCenterPoint();
        const angle = Math.atan2(y - point.y, point.x - x);
        const epx = x + (this.ellipse.getRx() * Math.cos(angle));
        const epy = y + (this.ellipse.getRy() * -Math.sin(angle));

        return new fabric.Point(epx, epy);
    }

    public onThoughtMove = (callback: () => void) => {
        this.moveCallbacks.push(callback);
    }

    public offThoughtMove = (callback: () => void) => {
        const callbackIndex = this.moveCallbacks.indexOf(callback);
        if (callbackIndex !== -1) {
            this.moveCallbacks.splice(callbackIndex, 1);
        }
    }

    private createGroup = () => {
        const group = new fabric.Group([this.ellipse, this.text], {
            originX: 'center',
            originY: 'center',
            hasControls: false,
            subTargetCheck: true
        });

        group.on('mousedblclick', this.editThoughtText);
        group.on('moving', this.thoughtMoved);

        return group;
    }

    private editThoughtText = () => {
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

    private thoughtMoved = () => {
        this.moveCallbacks.forEach((callback) => callback());
    }
}
