export class Subscribable<MessageType> {
    private _subscribers: Set<(cb: MessageType) => void> = new Set();


    subscribe(cb: (cb: MessageType) => void): () => void {
        this._subscribers.add(cb);
        return () => {
            this._subscribers.delete(cb);
        }
    }

    publish(msg: MessageType) {
        this._subscribers.forEach((l) => l(msg));
    }
}


export function FunctionSubscribable<MessageType>() {
    const _subscribers: Set<(cb: MessageType) => void> = new Set();

    return {
        subscribe(cb: (cb: MessageType) => void): () => void {
            _subscribers.add(cb);
            return () => {
                _subscribers.delete(cb);
            }
        },
        publish(msg: MessageType) {
            _subscribers.forEach((v) => v(msg));
        }
    }

}