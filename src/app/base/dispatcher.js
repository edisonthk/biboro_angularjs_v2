class Dispatcher{

    constructor () {
        this.listeners = [];
    }

    register(action, parameters ,callback) {

        this.listeners.push({
            action:     action,
            callback:   callback,
            parameters: parameters,
        });
    }

    dispatch(action, parameters) {
        this.listeners.forEach((payload) => {
            if(payload.action === action) {
                payload.callback(parameters);
            }
        });
    }
}

export default Dispatcher;