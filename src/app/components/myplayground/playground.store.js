import Dispatcher from "../../base/dispatcher";

class PlaygroundStore {
    
    constructor() {
        this.MYSTORE_KEY = "MYSTORE_KEY";
        this.dispatcher = new Dispatcher();


        this.data = [];

        // dummy data        
        this.count = 0;
    }

    registerGetCallback(callback) {
        var parameters = {'request':'playgroundStore'};

        this.dispatcher.register(this.MYSTORE_KEY,  parameters,callback);
    }


    dispatchGetAction() {
        var self = this;

        setTimeout(() => {
            self.count += 1;
            self.data.push(self.count);
            self.dispatcher.dispatch(this.MYSTORE_KEY, {"response":"mydata"});
        },2500);
    }

    getData() {
        return this.data;
    }

}

export default PlaygroundStore;
