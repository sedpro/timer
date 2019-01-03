export interface Storage {
    read: (key: string) => number|number[];

    write: (obj: Object) => void;
}