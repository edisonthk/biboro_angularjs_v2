class Dispatcher{

    constructor () {
        this.listeners = [];
    }

    register(action ,callback) {

        this.listeners.push({
            action:     action,
            callback:   callback,
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