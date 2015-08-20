import BaseService from "../../base/base.service";

class WorkbookService extends BaseService{
    constructor($http,Dispatcher) {
        super($http,Dispatcher);
        
        this.WORKBOOK_FETCHALL_CALLBACK = "WORKBOOK_FETCHALL_CALLBACK";
        this.WORKBOOK_STORE_CALLBACK = "WORKBOOK_STORE_CALLBACK";
        this.WORKBOOK_SHOW_CALLBACK = "WORKBOOK_SHOW_CALLBACK";
        this.WORKBOOK_UPDATE_CALLBACK = "WORKBOOK_UPDATE_CALLBACK";
        this.WORKBOOK_DESTROY_CALLBACK = "WORKBOOK_DESTROY_CALLBACK";
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

    registerUpdateCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_UPDATE_CALLBACK,callback);
    }

    registerDestroyAllCallback(callback) {
        this._dispatcher.register(this.WORKBOOK_DESTROY_CALLBACK,callback);
    }

    fetchAll() {
        var self = this;

        self._http.get('/api/v1/workbook/index.json')
            .success(function(data){

                self.workbooks = data;
                self._dispatcher.dispatch(self.WORKBOOK_FETCHALL_CALLBACK, {"success":true,"result":"success","response":self.getAll()});
            })
            .error(function(){
                console.log("error in workbook.strore.js");
                self._dispatcher.dispatch(self.WORKBOOK_FETCHALL_CALLBACK, {"success":false,"result":"fail to fetch workbooks."});
            });

    }

    store(){
        var self= this;

        self._http.post('/api/v1/workbook/index.json')
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_STORE_CALLBACK, {"success":true,"result":"success", "response": response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_STORE_CALLBACK, {"success":false,"result":"fail to store workbooks."});
            });
    }

    show(id){
        var self= this;

        self._http.get('/api/v1/workbook/'+id+'.json')
            .success(function(response){
                self.workbook = response;
                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_SHOW_CALLBACK, {"success":false,"result":"fail to show workbooks."});
            });
    }

    update(id){
        var self= this;

        self._http.put('/api/v1/workbook/'+id+'.json')
            .success(function(response){
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.WORKBOOK_UPDATE_CALLBACK, {"success":false,"result":"fail to update workbooks."});
            });
    }

    destroy(id){
        var self= this;

        self._http.delete('/api/v1/workbook/'+id+'.json')
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
