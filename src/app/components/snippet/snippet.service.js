class SnippetService {

    constructor($http,Dispatcher) {
        this.SNIPPET_FETCHEDALL_CALLBACK = "SNIPPET_FETCHEDALL_CALLBACK";
        this.SNIPTET_STORE_CALLBACK = "SNIPPET_STORE_CALLBACK";
        this.SNIPPET_SHOW_CALLBACK = "SNIPPET_SHOW_CALLBACK";
        this.SNIPPET_UPDATE_CALLBACK = "SNIPPET_UPDATE_CALLBACK";
        this.SNIPPET_DESTROY_CALLBACK = "SNIPPET_DESTROY_CALLBACK";

        this._dispatcher = Dispatcher;
        this._http       = $http;

        this.snippets = [];

    }

    registerFetchedAllCallback(callback) {
        this._dispatcher.register(this.SNIPPET_FETCHEDALL_CALLBACK,callback);
    }

    registerStoreCallback(callback) {
        this._dispatcher.register(this.SNIPPET_STORE_CALLBACK,callback);
    }

    registerShowCallback(callback) {
        this._dispatcher.register(this.SNIPPET_SHOW_CALLBACK,callback);
    }

    registerUpdateCallback(callback) {
        this._dispatcher.register(this.SNIPPET_UPDATE_CALLBACK,callback);
    }

    registerDestroyAllCallback(callback) {
        this._dispatcher.register(this.SNIPPET_DESTROY_CALLBACK,callback);
    }


    fetchAll() {
        var self = this;

        self._http.get('/api/v1/snippet/index.json')
            .success(function(data){
                self.snippets = data;
                self._dispatcher.dispatch(self.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","response":self.getSnippets()});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to fetch snippets."});
            });

    }

    store(){
        var self= this;

        self._http.post('/api/v1/snippet/index.json')
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_STORE_CALLBACK, {"success":true,"result":"success", "response": response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_STORE_CALLBACK, {"success":false,"result":"fail to store snippets."});
            });
    }

    show(id){
        var self= this;

        self._http.get('/api/v1/snippet/'+id+'/index.json')
            .success(function(response){
                self.snippets = response;
                self._dispatcher.dispatch(self.SNIPPET_SHOW_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_SHOW_CALLBACK, {"success":false,"result":"fail to show snippets."});
            });
    }

    update(id){
        var self= this;

        self._http.put('/api/v1/snippet/'+id+'/index.json')
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE_CALLBACK, {"success":false,"result":"fail to update snippets."});
            });
    }

    destroy(id){
        var self= this;

        self._http.delete('/api/v1/snippet/'+id+'/index.json')
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY_CALLBACK, {"success":false,"result":"fail to destroy snippets."});
            });
    }


    getSnippets(){
        return this.snippets;
    }

}

export default SnippetService;
