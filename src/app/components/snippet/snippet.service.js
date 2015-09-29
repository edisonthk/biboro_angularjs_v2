
class SnippetService {

    constructor($http, $state, $stateParams, Dispatcher, Api) {
        this.SNIPPET_FETCHALL = "SNIPPET_FETCHALL";
        this.SNIPPET_STORE = "SNIPPET_STORE";
        this.SNIPPET_SHOW = "SNIPPET_SHOW";
        this.SNIPPET_UPDATE = "SNIPPET_UPDATE";
        this.SNIPPET_DESTROY = "SNIPPET_DESTROY";
        this.SNIPPET_FORK = "SNIPPET_FORK";


        this._dispatcher = Dispatcher;
        this._http       = $http;
        this.state       = $state;
        this.stateParams = $stateParams;


        this.snippets = [];
        this.snippet = null;

        this.api = Api;
    }

    fork(params) {
        var self = this;

        var req = {
            method : self.api.snippet.fork.method,
            url    : self.api.snippet.fork.url,
            data   : self.filterParams(params),   
        };

        self._http[req.method](req.url, req.data)
            .success(function(data){
                self.snippets.unshift(data);
                self._dispatcher.dispatch(self.SNIPPET_FORK, {"success":true,"result":"success"});
            })
            .error(function(err){
                self._dispatcher.dispatch(self.SNIPPET_FORK, {"success":false,"result":"fail to fetch snippets.","error":err});
            });
    }


    fetchAll() {
        var self = this;

        var req = {
            method : self.api.snippet.index.method,
            url    : self.api.snippet.index.url,
        };

        self._http[req.method](req.url, req.data)
            .success(function(data){
                self.snippets = data;
                self._dispatcher.dispatch(self.SNIPPET_FETCHALL, {"success":true,"result":"success","response":self.getSnippets()});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.SNIPPET_FETCHALL, {"success":false,"result":"fail to fetch snippets."});
            });

    }

    store(params){
        var self= this;

        var req = {
            method : self.api.snippet.store.method,
            url    : self.api.snippet.store.url,
            data   : self.filterParams(params)
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.snippet = response;
                self.snippets.unshift(response);
                self._dispatcher.dispatch(self.SNIPPET_STORE, {"success":true,"result":"success"});
            })
            .error(function(err){
                self._dispatcher.dispatch(self.SNIPPET_STORE, {"success":false,"result":"fail to store snippets.","error":err});
            });
    }

    show(id){
        var self= this;
        var snippet = self.getById(id);
        if(snippet !== null) {
            self._dispatcher.dispatch(self.SNIPPET_SHOW, {"success":true,"result":"success","response":snippet});
            return ;
        }

        var req = {
            method : self.api.snippet.show.method,
            url    : self.api.snippet.show.url.replace(":id",id),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.setSingleSnippet(id, response);
                self.snippet = response;
                self._dispatcher.dispatch(self.SNIPPET_SHOW, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_SHOW, {"success":false,"result":"fail to show snippets."});
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
                self.setSingleSnippet(id, response);
                self._dispatcher.dispatch(self.SNIPPET_UPDATE, {"success":true,"result":"success","response":response});
            })
            .error(function(err){
                self._dispatcher.dispatch(self.SNIPPET_UPDATE, {"success":false,"result":"fail to update snippets.","error":err});
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
                self._dispatcher.dispatch(self.SNIPPET_DESTROY, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.SNIPPET_DESTROY, {"success":false,"result":"fail to destroy snippets."});
            });
    }

    setSingleSnippet(snippetId, snippet) {
        snippetId = parseInt(snippetId);
        for (var i = 0; i < this.snippets.length; i++) {
            if(this.snippets[i].id === snippetId) {
                for(var key in snippet) {
                    this.snippets[i][key] = snippet[key];    
                }
                
            }
        }
    }

    setSnippets(snippets) {
        if(!snippets) {
            return;
        }

        this.snippets = snippets.length > 0 ? snippets : [];
    }

    getFocusSnippet() {
        return this.snippet;
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

    filterParams(params) {

        // tags
        var tags = [];
        for (var i = 0; i < params.tags.length; i++) {
            if(typeof params.tags[i] === 'object') {
                tags.push(params.tags[i].name);
            }
        }
        params.tags = tags;

        return params;
    }

}

export default SnippetService;
