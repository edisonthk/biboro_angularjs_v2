class PlaygroundStore {
    
    constructor(dispatcher) {
        this.MYSTORE_KEY = "MYSTORE_KEY";
        this._dispatcher = dispatcher;

        console.log(this._dispatcher);
        this.data = [];

        // dummy data        
        this.count = 0;
    }

    registerGetCallback(callback) {
        var parameters = {'request':'playgroundStore'};

        this._dispatcher.register(this.MYSTORE_KEY,  parameters,callback);
    }


    dispatchGetAction() {
        var self = this;

        setTimeout(() => {
            self.count += 1;
            self.data.push(self.count);
            self._dispatcher.dispatch(this.MYSTORE_KEY, {"response":"mydata"});
        },2500);
    }

    getData() {
        return this.data;
    }

}

export default PlaygroundStore;