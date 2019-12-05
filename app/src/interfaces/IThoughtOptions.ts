import ThoughtSize from '../enums/thoughtSize';

export default interface IThoughtOptions {
    x: number;
    y: number;
    size: ThoughtSize;
    id?: string;
    text?: string;
    color?: string;
}
