let EventSystem = (()=> {

    function defineMethods(obj, methods) {
        methods.forEach(method => {
            defineMethod(obj, method);
        });
    }

    function defineMethod(obj, method) {
        if (typeof method != "function") {
            throw new Error('method is not a function');
        }
        Object.defineProperty(obj, method.name, {
            get: () => method
        });
    }

    function EventSystem() {

        if (!(this instanceof EventSystem))
            throw new Error('EventSystem is constructor, call with "new"');

        let handlers = {};
        let handlerIdIterable = 0;

        defineMethods(this, [
            on,
            emit,
            removeHandler
        ]);

        function on(eventName, handler) {
            if (typeof eventName != "string")
                throw new Error('invalid eventName');
            if (typeof handler != 'function')
                throw new Error('handler is not a function');
            if (!handlers[eventName])
                handlers[eventName] = {};

            handlers[eventName][++handlerIdIterable] = handler;

            return handlerIdIterable;
        }

        function emit(eventName) {
            let toEmit = handlers[eventName];
            if (toEmit) {
                let args = [];
                for (let i = 1; i < arguments.length; i++)
                    args.push(arguments[i]);

                for (let id in toEmit)
                    toEmit[id](...args);
            }
        }

        function removeHandler(id) {
            if (typeof id == "string") {
                if (handlers[id]) {
                    delete handlers[id];
                    return true;
                }
            } else if (Number.isInteger(id)) {
                for (let eventName in handlers) {
                    let toFind = handlers[eventName];
                    for (let handlerId in toFind) {
                        if (handlerId === id) {
                            delete toFind[id];
                            return true;
                        }
                    }
                }
            } else
                throw new Error('invalid id/eventName');
            return false;
        }
    }

    return EventSystem;

})();