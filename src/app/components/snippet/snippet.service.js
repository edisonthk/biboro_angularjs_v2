import FluxService from "../flux/flux.service";

class SnippetService extends FluxService{

    constructor($http, Dispatcher, Api) {
        'ngInject';

        super.constructor($http, Dispatcher);

        this.api = Api;

        this.setDispatcherKey([    
                "SNIPPET_STORE",
                "SNIPPET_SHOW",
                "SNIPPET_UPDATE",
                "SNIPPET_DESTROY",
                "SNIPPET_FORK",
            ]); 

        
    }

    fork(params) {
        this.request({
            method : this.api.snippet.fork.method,
            url    : this.api.snippet.fork.url,
            data   : this.filterParams(params),   
            dispatcher: "SNIPPET_FORK",
            success: function(res) {
                this.appendData(res);
            }
        });
    }

    store(params) {
        this.request({
            method : this.api.snippet.store.method,
            url    : this.api.snippet.store.url,
            data   : this.filterParams(params),   
            dispatcher: "SNIPPET_STORE",
            success: function(res) {
                this.appendData(res);
            }
        });
    }


    update(id, params){
        this.request({
            method : this.api.snippet.update.method,
            url    : this.api.snippet.update.url.replace(":id",id),
            data   : params,   
            dispatcher: "SNIPPET_UPDATE",
            success: function(res) {
                this.setSingleSnippet(res);
            }
        });
    }

    destroy(id){
        this.request({
            method : this.api.snippet.destroy.method,
            url    : this.api.snippet.destroy.url.replace(":id",id),
            data   : params,   
            dispatcher: "SNIPPET_DESTROY",
            success: function(res) {
                this.disposeDataById(wbId);
            }
        });
    }

    setSingleSnippet(snippet) {
        this.setDataInsideGroup(snippet);
    }

    setSnippets(snippets) {
        this.setGroup(snippets);
    }

    getFocusSnippet() {
        return this.getFocusData();
    }

    getSnippets(){
        return this.getAllData();
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
