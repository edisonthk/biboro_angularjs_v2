import FluxService from "../flux/flux.service";

class WorkbookService extends FluxService{
    constructor($http, Dispatcher, $cacheFactory, SnippetService, Api) {
        'ngInject';

        super.constructor($http, Dispatcher, $cacheFactory);
        
        this.snippet = SnippetService;
        this.api = Api;

        this.setDispatcherKey([
                "WORKBOOK_FETCHALL",
                "WORKBOOK_STORE",
                "WORKBOOK_SHOW",
                "WORKBOOK_UPDATE",
                "WORKBOOK_DESTROY",
                "WORKBOOK_SHOWMY",
            ]);
    }
    
    fetchAll() {

        this.request({
            method : this.api.workbook.index.method,
            url    : this.api.workbook.index.url,
            dispatcher: "WORKBOOK_FETCHALL",
            success: function(res) {
                this.setWorkbooks(res);
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


    getAll(){
        // console.log("b2");
        return this.getAllData();
    }

    getCurrentWorkbook() {
        // console.log("b2");
        return this.getFocusData();
    }

    getCurrentWorkbookSnippets(){
        if(this.getFocusData()){
            // console.log("b2");
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

}

export default WorkbookService;
