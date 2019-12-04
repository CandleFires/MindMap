import ThoughtSize from '../enums/thoughtSize';

export default interface IThoughtOptions {
    x: number;
    y: number;
    size: ThoughtSize;
    color?: string;
}
