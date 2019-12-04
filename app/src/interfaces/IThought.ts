import ThoughtSize from '../enums/thoughtSize'

export default interface IThought {
    id: string;
    x: number;
    y: number;
    size: ThoughtSize;
    text: string;
    connections: Array<string>
}