import BaseService from "../../base/base.service";

class WorkbookService extends BaseService{
    constructor($http,Dispatcher, SnippetService, Api) {
        
        this._http = $http;
        this._dispatcher = Dispatcher;
        this.snippet = SnippetService;
        this.api = Api;
        
        this.WORKBOOK_FETCHALL_CALLBACK = "WORKBOOK_FETCHALL_CALLBACK";
        this.WORKBOOK_STORE_CALLBACK    = "WORKBOOK_STORE_CALLBACK";
        this.WORKBOOK_SHOW_CALLBACK     = "WORKBOOK_SHOW_CALLBACK";
        this.WORKBOOK_UPDATE_CALLBACK   = "WORKBOOK_UPDATE_CALLBACK";
        this.WORKBOOK_DESTROY_CALLBACK  = "WORKBOOK_DESTROY_CALLBACK";
        this.WORKBOOK_SHOWMY_CALLBACK   = "WORKBOOK_SHOWMY_CALLBACK";
        this.WORKBOOK_RENAME_CALLBACK   = "WORKBOOK_RENAME_CALLBACK";

    }
    registerFetchAllCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_FETCHALL_CALLBACK,callback);
    }

    registerStoreCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_STORE_CALLBACK,callback);
    }

    registerShowCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_SHOW_CALLBACK,callback);
    }
    registerShowMyCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_SHOWMY_CALLBACK,callback);   
    }

    registerUpdateCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_UPDATE_CALLBACK,callback);
    }

    registerDestroyAllCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_DESTROY_CALLBACK,callback);
    }

    registerRenameCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_RENAME_CALLBACK, cb);
    }

    fetchAll() {
        var self = this;

        self._http.get(self.api.workbook.index)
            .success(function(data){

                self.workbooks = data;
                self._dispatcher.dispatch(self.WORKBOOK_FETCHALL_CALLBACK, {"success":true,"result":"success","response":self.getAll()});
            })
            .error(function(){
                console.log("error in workbook.strore.js");
                self._dispatcher.dispatch(self.WORKBOOK_FETCHALL_CALLBACK, {"success":false,"result":"fail to fetch workbooks."});
            });

    }

    store(params){
        var self= this;

        if(typeof params === 'undefined') {
            params = {};
        }

        self._http.post(self.api.workbook.index, params)
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_STORE_CALLBACK, {"success":true,"result":"success", "response": response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_STORE_CALLBACK, {"success":false,"result":"fail to store workbooks."});
            });
    }

    rename(id, params) {
        var self = this;
        
        self._http.put(self.api.workbook.rename.replace(":id",id), params)
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_RENAME_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_RENAME_CALLBACK, {"success":false,"result":"fail to update workbooks."});
            });
    }

    show(id){
        var self= this;

        self._http.get(self.api.workbook.show.replace(":id",id))
            .success(function(response){
                self.workbook = response;
                self.snippet.setSnippets(self.workbook.snippets);


                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":true,"result":"success","response":response});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","response":self.workbook.snippets});
                self._dispatcher.dispatch(self.snippet.SNIPPET_SHOW_CALLBACK, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_SHOW_CALLBACK, {"success":false,"result":"fail to show workbooks."});
            });
    }

    showMy() {
        var self = this;

        self._http.get(self.api.workbook.show.replace(":id","my"))
            .success(function(response){
                self.workbook = null;
                // response from /api/v1/workbook/my.json is snippets, so it can be set directly
                self.snippet.setSnippets(response);

                self._dispatcher.dispatch(self.WORKBOOK_SHOWMY_CALLBACK, {"success":true,"result":"success","response":response});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOWMY_CALLBACK, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to show workbooks."});
            });   
    }

    update(id){
        var self= this;

        self._http.put(self.api.workbook.show.replace(":id",id))
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE_CALLBACK, {"success":false,"result":"fail to update workbooks."});
            });
    }

    destroy(id){
        var self= this;

        self._http.delete(self.api.workbook.show.replace(":id",id))
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_DESTROY_CALLBACK, {"success":true,"result":"workbook","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_DESTROY_CALLBACK, {"success":false,"result":"fail to destroy workbooks."});
            });
    }


    getAll(){
        return this.workbooks;
    }

    getById(workbookId) {
        workbookId = parseInt(workbookId);
        for (var i = 0; i < this.workbooks.length; i++) {
            if(this.workbooks[i].id === workbookId) {
                return this.workbooks[i];
            }
        };
        return null;
    }

}

export default WorkbookService;
