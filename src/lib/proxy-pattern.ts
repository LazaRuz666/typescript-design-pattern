import { Subscribable} from "./pattern-pub-sub";

type ObservableMessage<T> = {
    target: T;
    prop: string;
};

type Observable<T> = T & {
    subscribe: (cb: (data: ObservableMessage<T>) => void) => void;
};

function createObservable<T>(data: T): Observable<T> {
    const subscribers = new Subscribable<ObservableMessage<T>>();

    return new Proxy({
        ...data,
        subscribe: subscribers.subscribe,
    }, {
        set: function(target: object, prop: string, value: any) {
            Reflect.set(target, prop, value);
            subscribers.publish({
                target,
                prop
            } as unknown as ObservableMessage<T>);
            return true;
        }
    }) as Observable<T>
}