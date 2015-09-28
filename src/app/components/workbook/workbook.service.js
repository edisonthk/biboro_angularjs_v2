import BaseService from "../../base/base.service";

class WorkbookService extends BaseService{
    constructor($http, $stateParams, Dispatcher, SnippetService, Api) {
        
        this._http = $http;
        this.stateParams  = $stateParams;
        this._dispatcher = Dispatcher;
        this.snippet = SnippetService;
        this.api = Api;

        this.workbook = null;
        this.workbooks = [];
        
        this.WORKBOOK_FETCHALL = "WORKBOOK_FETCHALL";
        this.WORKBOOK_STORE    = "WORKBOOK_STORE";
        this.WORKBOOK_SHOW     = "WORKBOOK_SHOW";
        this.WORKBOOK_UPDATE   = "WORKBOOK_UPDATE";
        this.WORKBOOK_DESTROY  = "WORKBOOK_DESTROY";
        this.WORKBOOK_SHOWMY   = "WORKBOOK_SHOWMY";

        // setTimeout(function() {

        //     scope.$apply();
        // });

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
                self._dispatcher.dispatch(self.WORKBOOK_FETCHALL, {"success":true,"result":"success","response":self.getAll()});
            })
            .error(function(){
                console.log("error in workbook.strore.js");
                self._dispatcher.dispatch(self.WORKBOOK_FETCHALL, {"success":false,"result":"fail to fetch workbooks."});
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
                self._dispatcher.dispatch(self.WORKBOOK_STORE, {"success":true,"result":"success", "response": response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_STORE, {"success":false,"result":"fail to store workbooks."});
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
                self.workbook = response.workbook;
                self.workbook.snippets = response.snippets;
                self.snippet.setSnippets(response.snippets);
                
                self._dispatcher.dispatch(self.WORKBOOK_SHOW, {"success":true,"result":"success"});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL, {"success":true,"result":"success"});
                
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOW, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL, {"success":false,"result":"fail to show workbooks."});
                
            });
    }

    search(id, query) {
        var self= this;

        var req = {
            method : self.api.workbook.search.method,
            url    : self.api.workbook.search.url.replace(":id",id).replace(":query",query),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.workbook = response.workbook;
                self.workbook.snippets = response.snippets;
                self.snippet.setSnippets(response.snippets);


                self._dispatcher.dispatch(self.WORKBOOK_SHOW, {"success":true,"result":"success"});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL, {"success":true,"result":"success"});
                
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOW, {"success":false,"result":"fail to show workbooks."});
                self._dispatcher.dispatch(self.snippet.SNIPPET_FETCHEDALL, {"success":false,"result":"fail to show workbooks."});
                
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
                console.log(response);
                for (var i = 0; i < self.workbooks.length; i++) {
                    if(self.workbooks[i].id === wb.id) {
                        self.workbooks[i] = wb;
                        break;
                    }
                }

                self._dispatcher.dispatch(self.WORKBOOK_SHOW, {"success":true,"result":"success","response":response});
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE, {"success":false,"result":"fail to update workbooks."});
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
                self._dispatcher.dispatch(self.WORKBOOK_DESTROY, {"success":true,"result":"workbook","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_DESTROY, {"success":false,"result":"fail to destroy workbooks."});
            });
    }


    getAll(){
        return this.workbooks;
    }

    getCurrentWorkbook() {
        return this.workbook;
    }

    getById(workbookId) {
        workbookId = parseInt(workbookId);
        for (var i = 0; i < this.workbooks.length; i++) {
            if(this.workbooks[i].id === workbookId) {
                return this.workbooks[i];
            }
        }
        return null;
    }

    getCurrentWorkbookSnippets(){
        if(this.workbook){
            return this.workbook.snippets;
        }
    }

}

export default WorkbookService;
