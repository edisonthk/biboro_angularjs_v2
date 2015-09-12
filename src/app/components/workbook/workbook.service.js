import BaseService from "../../base/base.service";

class WorkbookService extends BaseService{
    constructor($http,Dispatcher, SnippetService, Api) {
        
        this._http = $http;
        this._dispatcher = Dispatcher;
        this.snippet = SnippetService;
        this.api = Api;

        this.workbooks = [];
        
        this.WORKBOOK_FETCHALL_CALLBACK = "WORKBOOK_FETCHALL_CALLBACK";
        this.WORKBOOK_STORE_CALLBACK    = "WORKBOOK_STORE_CALLBACK";
        this.WORKBOOK_SHOW_CALLBACK     = "WORKBOOK_SHOW_CALLBACK";
        this.WORKBOOK_UPDATE_CALLBACK   = "WORKBOOK_UPDATE_CALLBACK";
        this.WORKBOOK_DESTROY_CALLBACK  = "WORKBOOK_DESTROY_CALLBACK";
        this.WORKBOOK_SHOWMY_CALLBACK   = "WORKBOOK_SHOWMY_CALLBACK";
        this.WORKBOOK_FORK_CALLBACK     = "WORKBOOK_FORK_CALLBACK";

        setTimeout(function() {

            scope.$apply();
        });

    }
    registerFetchAllCallback(cb) {
        
        this._dispatcher.register(this.WORKBOOK_FETCHALL_CALLBACK,cb);
    }

    registerStoreCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_STORE_CALLBACK,cb);
    }

    registerShowCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_SHOW_CALLBACK,cb);
    }
    registerShowMyCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_SHOWMY_CALLBACK,cb);   
    }

    registerUpdateCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_UPDATE_CALLBACK,cb);
    }

    registerDestroyAllCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_DESTROY_CALLBACK,cb);
    }

    registerForkedCallback(cb) {
        this._dispatcher.register(this.WORKBOOK_FORK_CALLBACK, cb);
    }

    fetchAll() {
        var self = this;

        var req = {
            method : self.api.workbook.index.method,
            url    : self.api.workbook.index.url,
        };

        self._http[req.method](req.url, req.data)
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

        var req = {
            method : self.api.workbook.store.method,
            url    : self.api.workbook.store.url,
            data   : params,
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_STORE_CALLBACK, {"success":true,"result":"success", "response": response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_STORE_CALLBACK, {"success":false,"result":"fail to store workbooks."});
            });
    }

    show(id){
        var self= this;

        var req = {
            method : self.api.workbook.show.method,
            url    : self.api.workbook.show.url.replace(":id",id),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.workbook = response;
                self.snippet.setSnippets(self.workbook.snippets);


                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":true,"result":"success","response":response});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","response":self.workbook.snippets});
                
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to show workbooks."});
                
            });
    }

    showMy() {
        var self = this;

        self._http.get(self.api.workbook.show.replace(":id","my"))
            .success(function(response){
                self.workbook = null;
                // response from /api/v1/workbook/my.json is snippet so it can be set directly
                self.snippet.setSnippets(response);

                self._dispatcher.dispatch(self.WORKBOOK_SHOWMY_CALLBACK, {"success":true,"result":"success","response":response});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOWMY_CALLBACK, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL_CALLBACK, {"success":false,"result":"fail to show workbooks."});
            });   
    }

    update(id, params){
        var self= this;

        var req = {
            method : self.api.workbook.update.method,
            url    : self.api.workbook.update.url.replace(":id",id),
            data   : params
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                var wb = response;
                for (var i = 0; i < self.workbooks.length; i++) {
                    if(self.workbooks[i].id === wb.id) {
                        self.workbooks[i] = wb;
                        break;
                    }
                };

                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":true,"result":"success","response":response});
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE_CALLBACK, {"success":false,"result":"fail to update workbooks."});
            });
    }

    destroy(id){
        var self= this;
        var req = {
            method : self.api.workbook.destroy.method,
            url    : self.api.workbook.destroy.url.replace(":id",id),
        };

        self._http[req.method](req.url, req.data)
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
        if(this.workbooks)

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
