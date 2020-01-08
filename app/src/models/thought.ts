import { fabric } from 'fabric';
import IThoughtOptions from '../interfaces/IThoughtOptions';
import Connection from './connection';
import ThoughtSize from '../enums/thoughtSize';
import { getUUID } from '../utility';
import IThought from '../interfaces/IThought';

export default class Thought {
    public connections: Array<Connection>;

    private id: string;
    private canvas: fabric.Canvas;
    private ellipse: fabric.Ellipse;
    private text: fabric.IText;
    private group: fabric.Group;
    private size: ThoughtSize;
    private moveCallbacks: Array<() => void>;
    private editing: boolean = false;

    constructor(canvas: fabric.Canvas, options: IThoughtOptions) {
        this.canvas = canvas;
        this.id = options.id || getUUID();
        this.connections = [];
        this.moveCallbacks = [];
        this.size = options.size;

        const size = this.getSizeParams(options.size);

        this.ellipse = new fabric.Ellipse({
            originX: 'center',
            originY: 'center',
            left: options.x,
            top: options.y,
            rx: size.width / 2,
            ry: size.height / 2,
            strokeWidth: 3,
            stroke: options.color || '#0074D9',
            fill: '#fefefe',
            hasControls: false,
            selectable: false
        });
        this.ellipse.on('moving', this.preventEllipseMovement);

        this.text = new fabric.IText(options.text || 'New thought', {
            originX: 'center',
            originY: 'center',
            left: options.x,
            top: options.y,
            fontFamily: 'Helvetica',
            fontSize: size.fontSize,
            hasControls: false,
            selectable: false
        });
        this.text.on('editing:exited', this.onEditExit);

        this.group = this.createGroup();
        this.canvas.add(this.group);

        document.addEventListener('keydown', this.handleKeyDown);
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
    public getSize = () => this.size;
    public getId = () => this.id;
    public getColor = () => this.ellipse.stroke;

    public getBorderPointAt = (point: fabric.Point) => {
        const {x, y} = this.group.getCenterPoint();
        const angle = Math.atan2(y - point.y, point.x - x);
        const epx = x + (this.ellipse.getRx() * Math.cos(angle));
        const epy = y + (this.ellipse.getRy() * -Math.sin(angle));

        return new fabric.Point(epx, epy);
    }

    public changeColor(color: string) {
        this.ellipse.set('stroke', color);
        this.canvas.renderAll();
    }

    public moveBy(x: number, y: number) {
        this.group.top! += y;
        this.group.left! += x;
        this.group.setCoords();
        this.thoughtMoved();
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

    public serialize = (mainPoint: fabric.Point): IThought => {
        const centerPoint = this.group.getCenterPoint();
        return {
            id: this.id,
            x: centerPoint.x - mainPoint.x,
            y: centerPoint.y - mainPoint.y,
            size: this.size,
            text: this.text.text || '',
            connections: this.connections.map((connection) => connection.getOtherId(this.id))
        }
    }

    public destroy = () => {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.remove(this.ellipse);
        this.canvas.remove(this.text);
        this.canvas.remove(this.group);
        this.connections.forEach((connection) => connection.destroy());
        this.moveCallbacks = [];
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
        this.editing = true;
    }

    private onEditExit = () => {
        this.editing = false;
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

    private getSizeParams = (size: ThoughtSize): { width: number, height: number, fontSize: number } => {
        switch (size) {
            case ThoughtSize.Main:
                return { width: 200, height: 100, fontSize: 20 };
            case ThoughtSize.Huge:
                return { width: 180, height: 90, fontSize: 18 };
            case ThoughtSize.Large:
                return { width: 160, height: 80, fontSize: 16 };
            case ThoughtSize.Medium:
                return { width: 140, height: 70, fontSize: 14 };
            case ThoughtSize.Small:
                return { width: 120, height: 60, fontSize: 12 };
            case ThoughtSize.Tiny:
                return { width: 100, height: 50, fontSize: 10 };
            default:
                return { width: 0, height: 0, fontSize: 0 };
        }
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && this.editing) {
            event.preventDefault();
            this.text.exitEditing();
        }
    }
}
