class PlaygroundStore {
    
    constructor($http,dispatcher) {
        this.MYSTORE_KEY = "MYSTORE_KEY";
        this._dispatcher = dispatcher;
        this._http       = $http;

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

        $http.get('/api/hello.json')
            .success(function(data) {
                self.data = data;
                self._dispatcher.dispatch(this.MYSTORE_KEY, {"response":data});
            });
    }

}

export default PlaygroundStore;