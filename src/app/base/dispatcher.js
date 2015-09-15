
class Dispatcher{

    constructor () {

        this.listeners = [];
        this.saltKey = 1;

        var self = this;
        
        self.lastListenerCount = self.listeners.length;
        setInterval(function() {
            if(self.lastListenerCount !== self.listeners.length) {
                self.lastListenerCount = self.listeners.length;

                var cnt = 0;
                for (var i = 0; i < self.listeners.length; i++) {
                    if(self.listeners[i].action === "WORKBOOK_FETCHALL") {
                        cnt += 1;
                    }
                }

                // 
                console.log("listeners count: "+self.listeners.length+" ,cnt: "+cnt);
            }
        },2000);
    }

    register(action ,callback) {

        var token = "A"+this.saltKey;
        this.listeners.push({
            token:      token,
            action:     action,
            callback:   callback,
        });

        this.saltKey += 1;

        return token;
    }

    dispatch(action, parameters) {

        this.listeners.forEach((payload) => {
            if(payload.action === action) {
                payload.callback(parameters);
            }
        });
    }

    detach(dispatcherToken) {
        if(Array.isArray(dispatcherToken)) {
            for (var i = 0; i < dispatcherToken.length; i++) {
                this.detach(dispatcherToken[i]);
            }
        }else {
            for (var i = 0; i < this.listeners.length; i++) {
                if(this.listeners[i].token === dispatcherToken) {
                    this.listeners.splice(i,1);
                    return;
                }
            }
        }
    }


}

export default Dispatcher;