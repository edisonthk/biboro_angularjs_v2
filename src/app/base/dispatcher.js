
class Dispatcher{

    constructor () {
        var self = this;
        self.listeners = [];
        self.lastListenerCount = self.listeners.length;
        setInterval(function() {
            if(self.lastListenerCount !== self.listeners.length) {
                self.lastListenerCount = self.listeners.length;

                // 
                // console.log("listeners count: "+self.listeners.length);
            }
        },2000);
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