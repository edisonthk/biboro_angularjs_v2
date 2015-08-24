
class SnippetService {

    constructor($http,Dispatcher, Api) {
        this.SNIPPET_FETCHEDALL_CALLBACK = "SNIPPET_FETCHEDALL_CALLBACK";
        this.SNIPTET_STORE_CALLBACK = "SNIPPET_STORE_CALLBACK";
        this.SNIPPET_SHOW_CALLBACK = "SNIPPET_SHOW_CALLBACK";
        this.SNIPPET_UPDATE_CALLBACK = "SNIPPET_UPDATE_CALLBACK";
        this.SNIPPET_DESTROY_CALLBACK = "SNIPPET_DESTROY_CALLBACK";

        this._dispatcher = Dispatcher;
        this._http       = $http;

        this.snippets = [];

        this.api = Api;
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

        self._http.get(self.api.snippet.index)
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

        self._http.post(self.api.snippet.index)
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_STORE_CALLBACK, {"success":true,"result":"success", "response": response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_STORE_CALLBACK, {"success":false,"result":"fail to store snippets."});
            });
    }

    show(id){
        var self= this;
        var snippet = self.getById(id);
        if(snippet !== null) {
            self._dispatcher.dispatch(self.SNIPPET_SHOW_CALLBACK, {"success":true,"result":"success","response":snippet});
            return ;
        }

        self._http.get(self.api.snippet.show.replace(":id",id))
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

        self._http.put(self.api.snippet.update.replace(":id",id))
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE_CALLBACK, {"success":false,"result":"fail to update snippets."});
            });
    }

    destroy(id){
        var self= this;

        self._http.delete(self.api.snippet.destroy.replace(":id",id))
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY_CALLBACK, {"success":false,"result":"fail to destroy snippets."});
            });
    }

    setSnippets(snippets) {
        this.snippets = snippets;
    }

    getSnippets(){
        return this.snippets;
    }

    getById(snippetId) {
        snippetId = parseInt(snippetId);
        for (var i = 0; i < this.snippets.length; i++) {
            if(this.snippets[i].id === snippetId) {
                return this.snippets[i];
            }
        }
        return null;
    }

}

export default SnippetService;
