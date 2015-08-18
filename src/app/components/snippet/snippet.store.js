class SnippetStore {
    
    constructor($http,dispatcher) {
        this.SNIPPET_FETCHEDALL_CALLBACK = "SNIPPET_FETCHEDALL_CALLBACK";
        this._dispatcher = dispatcher;
        this._http       = $http;

        this.snippets = [];

    }

    registerFetchedAllCallback(callback) {
        this._dispatcher.register(this.SNIPPET_FETCHEDALL_CALLBACK,callback);
    }


    fetchAll() {
        var self = this;

        self._http.get('/api/v1/snippet/index.json')
            .success(function(data){
                self.snippets.push(data);
                self._dispatcher.dispatch(self.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","data":self.getSnippets()});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to fetch snippets."});
            });
        
    }

    getSnippets(){
        return this.snippets;
    }

}

export default SnippetStore;