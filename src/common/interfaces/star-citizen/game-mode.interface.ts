export interface ISCGameMode<T=number> {
    id: T;
    name: string;
    active: boolean;
    prettyName: string;
}