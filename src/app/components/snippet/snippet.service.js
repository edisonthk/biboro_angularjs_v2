import FluxService from "../flux/flux.service";

class SnippetService extends FluxService{

    constructor($http, Dispatcher, Api) {
        'ngInject';

        super($http, Dispatcher);

        this.api = Api;

        this.setDispatcherKey([
                "SNIPPET_STORE",
                "SNIPPET_SHOW",
                "SNIPPET_UPDATE",
                "SNIPPET_DESTROY",
                "SNIPPET_FORK",
            ]);


    }

    show(snippetId) {
        this.request({
            method : this.api.snippet.show.method,
            url    : this.api.snippet.show.url.replace(":id",snippetId),
            dispatcher: "SNIPPET_SHOW",
            success: function(res) {
                this.setFocusSnippet(res);
                this.setSingleSnippet(res);
            }
        });
    }

    fork(params) {
        this.request({
            method : this.api.snippet.fork.method,
            url    : this.api.snippet.fork.url,
            data   : this.filterParams(params),
            dispatcher: "SNIPPET_FORK",
            success: function(res) {
                this.setSingleSnippet(res);
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
                this.setFocusSnippet(res);
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
            dispatcher: "SNIPPET_DESTROY",
            success: function(res) {
                this.disposeDataById(id);
            }
        });
    }

    setSingleSnippet(snippet) {
        this.setDataInsideGroup(this.transformSingleSnippet(snippet));
    }

    setFocusSnippet(snippet) {
        this.setFocusData(this.transformSingleSnippet(snippet));
    }

    setSnippets(snippets) {
        this.setGroup(this.transformSnippets(snippets));
    }

    getFocusSnippet() {
        // console.log("b2");
        return this.getFocusData();
    }

    getSnippets(){
        // console.log("b1");
        return this.getAllData();
    }

    transformSnippets(snippets) {
        for(var i = 0; i < snippets.length; i ++) {
            snippets[i] = this.transformSingleSnippet(snippets[i]);
        }
        return snippets;
    }

    transformSingleSnippet(snippet) {

        snippet.id = parseInt(snippet.id);
        snippet.account_id = parseInt(snippet.account_id);
        snippet.creator.id = parseInt(snippet.creator.id);

        if(snippet.reference) {
            snippet.reference.id = parseInt(snippet.reference.id);
            snippet.reference.method = parseInt(snippet.reference.method);
            snippet.reference.target = snippet.reference.target.match(/^[0-9]+$/) ? parseInt(snippet.reference.target) : snippet.reference.target ;
        }
        return snippet;
    }

    filterParams(params) {

        if(!params.tags) {
            return params;
        }

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

    clearSnippets() {
        this.disposeAllData();
    }

}

export default SnippetService;
