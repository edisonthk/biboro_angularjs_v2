
class SnippetService {

    constructor($http,Dispatcher, Api) {
        this.SNIPPET_FETCHEDALL_CALLBACK = "SNIPPET_FETCHEDALL_CALLBACK";
        this.SNIPTET_STORE_CALLBACK = "SNIPPET_STORE_CALLBACK";
        this.SNIPPET_SHOW_CALLBACK = "SNIPPET_SHOW_CALLBACK";
        this.SNIPPET_UPDATE_CALLBACK = "SNIPPET_UPDATE_CALLBACK";
        this.SNIPPET_DESTROY_CALLBACK = "SNIPPET_DESTROY_CALLBACK";
        this.SNIPPET_FORKED_CALLBACK = "SNIPPET_FORKED_CALLBACK";

        // check or modify this constants by WorkbookController
        this.WORKBOOK_ACTION_FORK = "push"; 
        this.WORKBOOK_ACTION_DEFORK = "slice";


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

    registerForkCallback(cb) {
        this._dispatcher.register(this.SNIPPET_FORKED_CALLBACK, cb);
    }

    fork(id, workbookId) {
        var self = this;

        var params = {
            action:    this.WORKBOOK_ACTION_FORK,
            snippetId: id
        };

        var req = {
            method : self.api.workbook.fork.method,
            url    : self.api.workbook.fork.url.replace(":id",workbookId),
            data   : params   
        };

        self._http[req.method](req.url, req.data)
            .success(function(data){
                self.snippets = data;
                self._dispatcher.dispatch(self.SNIPPET_FORKED_CALLBACK, {"success":true,"result":"success","response":self.getSnippets()});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.SNIPPET_FORKED_CALLBACK, {"success":false,"result":"fail to fetch snippets."});
            });
    }


    fetchAll() {
        var self = this;

        var req = {
            method : self.api.snippet.index.method,
            url    : self.api.snippet.index.url.replace(":id",workbookId),
        };

        self._http[req.method](req.url, req.data)
            .success(function(data){
                self.snippets = data;
                self._dispatcher.dispatch(self.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","response":self.getSnippets()});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to fetch snippets."});
            });

    }

    store(params){
        var self= this;

        var req = {
            method : self.api.snippet.store.method,
            url    : self.api.snippet.store.url,
            data   : params
        };

        self._http[req.method](req.url, req.data)
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

        var req = {
            method : self.api.snippet.show.method,
            url    : self.api.snippet.show.url.replace(":id",id),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.snippets = response;
                self._dispatcher.dispatch(self.SNIPPET_SHOW_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_SHOW_CALLBACK, {"success":false,"result":"fail to show snippets."});
            });
    }

    update(id, params){
        var self= this;

        var req = {
            method : self.api.snippet.update.method,
            url    : self.api.snippet.update.url.replace(":id",id),
            data   : params,
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE_CALLBACK, {"success":false,"result":"fail to update snippets."});
            });
    }

    destroy(id){
        var self= this;

        var req = {
            method : self.api.snippet.destroy.method,
            url    : self.api.snippet.destroy.url.replace(":id",id),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY_CALLBACK, {"success":false,"result":"fail to destroy snippets."});
            });
    }

    setSnippets(snippets) {
        if(!snippets) {
            return;
        }

        this.snippets = snippets.length > 0 ? snippets : [];
        console.log(this.snippets)
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
