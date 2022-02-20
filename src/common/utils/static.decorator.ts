export function Static<T>() {
    return <U extends T>(constructor: U) => { constructor };
}