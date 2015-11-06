import FluxService from "../flux/flux.service";

class WorkbookService extends FluxService{
    constructor($http, Dispatcher, $cacheFactory, SnippetService, Api) {
        'ngInject';

        super($http, Dispatcher, $cacheFactory);
        
        this.snippet = SnippetService;
        this.api = Api;

        this.setDispatcherKey([
                "WORKBOOK_FETCHALL",
                "WORKBOOK_STORE",
                "WORKBOOK_SHOW",
                "WORKBOOK_UPDATE",
                "WORKBOOK_DESTROY",
                "WORKBOOK_SHOWMY",
                "WORKBOOK_ORDER_UPDATE",
            ]);
    }
    
    fetchAll() {

        this.request({
            method : this.api.workbook.index.method,
            url    : this.api.workbook.index.url,
            dispatcher: "WORKBOOK_FETCHALL",
            success: function(res) {
                this.setWorkbooks(this.updateWorkbookOrder(res));
            }
        });
    }

    store(params){

        if(typeof params === 'undefined') {
            params = {};
        }
        
        this.request({
            method : this.api.workbook.store.method,
            url    : this.api.workbook.store.url,
            data   : params,
            dispatcher: "WORKBOOK_STORE",
            success: function(res) {
                this.appendData(res);
            }
        });
    }

    show(id){

        // cache, it is no good because, it only store single workbook but not all kinds of workbook
        // if(this.snippet.getAllData().length > 0) {
        //     this.dispatch("WORKBOOK_SHOW", {success: true});
        //     return;
        // }

        this.snippet.clearSnippets();
        
        var cacheWorkbook = this.getWorkbookFromCache(id);
        if(cacheWorkbook != null) {
            this.setFocusData(cacheWorkbook);
        }

        this.request({
            method : this.api.workbook.show.method,
            url    : this.api.workbook.show.url.replace(":id",id),
            dispatcher: [
                "WORKBOOK_SHOW",
                this.snippet.key.SNIPPET_FETCHEDALL
            ],
            success: function(res) {
                this.setFocusData(res.workbook);
                this.snippet.setSnippets(res.snippets);
            }
        });
    }

    search(id, query) {

        if(query.match(/^[0-9]+$/)) {
            var snippets = this.getAllData();
            for (var i = 0; i < snippets.length; i++) {
                if((""+snippets[i].index).indexOf(query)) {
                    
                }
            }
        }

        this.request({
            method : this.api.workbook.search.method,
            url    : this.api.workbook.search.url.replace(":id",id).replace(":query",query),
            dispatcher: [
                "WORKBOOK_SHOW",
                this.snippet.key.SNIPPET_FETCHEDALL
            ],
            success: function(res) {
                this.setFocusData(res.workbook);
                this.snippet.setSnippets(res.snippets);
            }
        });
    }

    updateOrder(orders) {
        this.request({
            method : this.api.workbook.order.method,
            url    : this.api.workbook.order.url,
            data   : {orders: orders},
            dispatcher: [
                "WORKBOOK_ORDER_UPDATE",
            ],
            success: function() {
                var workbooks = this.getAllData();
                for (var i = 0; i < workbooks.length; i++) {
                    workbooks[i].order = orders[workbooks[i].id];
                }

                this.setWorkbooks(this.updateWorkbookOrder(workbooks));
            },
        });
    }

    update(id, params){

        this.request({
            method : this.api.workbook.update.method,
            url    : this.api.workbook.update.url.replace(":id",id),
            data   : params,
            dispatcher: [
                "WORKBOOK_SHOW",
                "WORKBOOK_UPDATE",
            ],
            success: function(res) {
                this.setWorkbookInsideGroup(res);
            }
        });
    }

    destroy(id) {
        this.request({
            method : this.api.workbook.destroy.method,
            url    : this.api.workbook.destroy.url.replace(":id",id),
            dispatcher: "WORKBOOK_DESTROY",
            success: function(res) {
                this.disposeWorkbook(id);
            }
        });

    }

    updateWorkbookOrder(workbooks) {

        for (var i = 0; i < workbooks.length; i++) {
            if(workbooks[i].order && workbooks[i].order !== i+1) {
                // swap
                workbooks[i] = [workbooks[workbooks[i].order - 1], workbooks[workbooks[i].order - 1] = workbooks[i]][0];
            }
        }
        return workbooks;
    }

    getAll(){
        return this.getAllData();
    }

    getCurrentWorkbook() {
        return this.getFocusData();
    }

    getCurrentWorkbookSnippets(){
        if(this.getFocusData()){
            return this.snippet.getAllData();
        }
    }

    disposeWorkbook(wbId) {
        this.disposeDataById(wbId);
    }

    setWorkbooks(workbooks) {
        this.setGroup(workbooks);
    }

    setWorkbook(wb) {
        this.setFocusData(wb);
    }

    setWorkbookInsideGroup(wb) {
        this.setDataInsideGroup(wb);
    }

    getWorkbookFromCache(id) {
        var workbooks = this.getAllData();
        for (var i = 0; i < workbooks.length; i++) {
            if(workbooks[i].id === parseInt(id)) {
                return workbooks[i];
            }
        }
        return null;
    }

}

export default WorkbookService;
