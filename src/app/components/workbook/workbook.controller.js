
import BaseController from "../../base/base.controller";

class WorkbookController extends BaseController {
    constructor($scope ,$state ,$stateParams ,WorkbookService, AccountService, RouteService, SnippetService, $log) {
        this._scope       = $scope;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.snippet      = SnippetService;
        this.route        = RouteService;
        this.workbook     = WorkbookService;
        this.account      = AccountService;
        this.warn = $log;
        this.editor         = {
            show     : false,
            title    : "",
            content  : "",
            tags     : [],
            workbook : null,
        };

        this.createDialog = {
            show: false
        };
        this.editDialog   = {
            show: false
        };

        // register action
        this.workbook.registerFetchAllCallback(this.fetchAllCallback.bind(this));
        this.workbook.registerShowCallback(this.showCallback.bind(this));
        this.workbook.registerShowMyCallback(this.showMyCallback.bind(this));
        this.workbook.registerStoreCallback(this.workbookStoreCallback.bind(this));
        this.workbook.registerUpdateCallback(this.updateCallback.bind(this));

        this.route.registerStateUpdatedCallback(this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);


        this.snippet.registerStoreCallback(this.storedCallback.bind(this));

        this.initialize();
    }

    initialize() {
        this.workbook.fetchAll();
        this.account.fetchLoginedAccount();

        this.workbooks = [];
        this.currentWorkbook = null;

        var workbook = this.stateParams.workbook;
        if(workbook) {
            if(workbook.match(/^\d+$/g)) {
                // workbook is number
                this.workbook.show(workbook);    
            }else if(workbook === 'me'){
                // workbook is my workbook, show my workbook
                this.workbook.showMy();
            }else {
                // workbook not found
            }
        }
    }

    fetchAllCallback(parameters) {
        this.workbooks = parameters.response;

        // set default value of workbook
        // this.editor.workbook = this.workbooks.length > 0 ? this.workbooks[0] : null;
    }

    showMyCallback(parameters) {
        // console.log(parameters);
        this.currentWorkbook = {
            id:       this.stateParams.workbook,
            title:    "マイ・ブック",
            snippets: parameters.response,
        };

        this.editDialog.title = this.currentWorkbook.title;
    }

    showCallback(parameters) {
        
        this.currentWorkbook = parameters.response;
        this.editDialog.title = this.currentWorkbook.title;

    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

    stateUpdatedCallback(parameters) {
        // console.log(parameters);
        // this.currentWorkbook = null;
        // console.log(parameters);
    }

    showCreateDialog() {
        this.createDialog.show = true;
    }

    createDialogOutsideClickedCallback() {
        this.createDialog.show = false;
    }

    createDialogWorkbookEvent() {
        this.workbook.store({
            title: this.createDialog.title
        });
    }

    workbookStoreCallback(parameters) {
        console.log("fdsfsdfsdfsd");
        if(parameters.result) {
            var workbook = parameters.response;
            console.log(this.state);
            this.state.go("workbookShow",{workbook: workbook.id});
        }
        this.createDialog.show = false;
    }

    // 
    showEditDialog() {
        this.editDialog.show = true;
    }

    // edit dialog event
    editDialogOutsideClickedCallback () {
        this.editDialog.show = false;
    }

    editDialogUpdateWorkbookEvent() {
        var formData = {
            title: this.editDialog.title
        };

        this.workbook.update(this.stateParams.workbook ,formData);
    }

    updateCallback(parameters) {
        if(parameters.success) {
            var workbook = parameters.response;
        }
    }

    /**
     *  crud snippet
     *
     */
    newSnippet() {
        this.editor.show = true;
    }

    editorSavedCallback() {
        // this.editor.show = false;
        this.snippet.store({
            title: this.editor.title,
            content: this.editor.content,
            tags: this.editor.tags,
            workbookId: this.editor.workbook === null ? 0 : this.editor.workbook.id ,
        });
    }

    storedCallback(parameters) {
        console.log(parameters);
    }

    editorQuitCallback() {
        this.editor.show = false;
    }

    editorCancelCallback() {
        this.editor.show = false;
    }
}

export default WorkbookController;
