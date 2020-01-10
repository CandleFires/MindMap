import ThoughtSize from '../enums/thoughtSize'

export default interface IThought {
    id: string;
    x: number;
    y: number;
    color: string;
    size: ThoughtSize;
    text: string;
    connections: Array<string>
}