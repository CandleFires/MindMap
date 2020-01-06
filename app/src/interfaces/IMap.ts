import IThought from './IThought';

export default interface IMap {
    id?: string;
    name: string;
    thoughts: Array<IThought>;
}
