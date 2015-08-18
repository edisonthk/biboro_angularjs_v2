class PlaygroundStore {
    
    constructor($http,dispatcher) {
        this.MYSTORE_KEY = "MYSTORE_KEY";
        this._dispatcher = dispatcher;
        this._http       = $http;

        this.data = [];

        // dummy data        
        this.count = 0;
    }

    registerGetCallback(callback) {
        this._dispatcher.register(this.MYSTORE_KEY,callback);
    }


    dispatchGetAction() {
        var self = this;

        self._http.get('/api/v1/snippet/index.json')
            .success(function(data) {
                self.data = data;
                self._dispatcher.dispatch(this.MYSTORE_KEY, {"response":data});
            });
    }

}

export default PlaygroundStore;