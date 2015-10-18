import Helper from "../helper/helper";
import FluxController from "../flux/flux.controller";

class WorkbookShowController extends FluxController {
    constructor($scope ,$state ,$stateParams ,Dispatcher,WorkbookService, AccountService, RouteService, SnippetService, Markdown, toastr) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.toast        = toastr;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.snippet      = SnippetService;
        this.route        = RouteService;
        this.workbook     = WorkbookService;
        this.account      = AccountService;
        this.markdown     = Markdown;


        this.createDialog = {
            show: false
        };
        this.editDialog   = {
            show: false
        };
        this.deleteWorkbookDialog = {
            show: false
        };

        // register action
        this.registerCallbacks({
            // workbook
            WORKBOOK_SHOW    : this.showCallback,
            WORKBOOK_STORE   : this.workbookStoreCallback,
            WORKBOOK_UPDATE  : this.workbookUpdatedCallback,

            // account
            ACCOUNT_FETCH    : this.fetchedLoginedAccountCallback,

            // route
            ROUTE_UPDATED    : this.stateUpdatedCallback,
        });

        // dialog
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);
        this.deleteWorkbookDialog.outsideClickedCallback = this.deleteWorkbookDialogOutsideClickedCallback.bind(this);
        this.initialize();

    }

    initialize() {
        this.account.fetchLoginedAccount();

        this.workbook.fetchAll();
        this.currentWorkbook = null;
        this.savingFlag = false;
        this.notfound = false;

        var workbook = this.stateParams.workbook;
        if(workbook) {
            this.workbook.show(workbook);
        }
    }

    showCallback(res) {
        if(!res.success) {
            this.notfound = true;
            return;
        }

        this.currentWorkbook = this.workbook.getCurrentWorkbook();
        this.editDialog.title = this.currentWorkbook.title;

        // for debug purpose
        // this.commentBox.snippet = this.currentWorkbook.snippets[0];

    }

    fetchedLoginedAccountCallback() {
        // console.log(parameters);
    }

    stateUpdatedCallback() {
        this.currentWorkbook = null;
    }

    showCreateDialog() {
        this.createDialog.show = true;
    }

    createDialogOutsideClickedCallback() {
        this.createDialog.show = false;
    }

    createDialogWorkbookEvent() {
        if(this.savingFlag) {
            return;
        }

        this.savingFlag = true;
        this.workbook.store({
            title: this.createDialog.title
        });
    }

    workbookStoreCallback(res) {
        if(res.result) {
            var workbook = res.response;
            this.state.go("workbook.show",{workbook: workbook.id});
        }
        this.createDialog.show = false;
        this.savingFlag = false;
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
        if(this.savingFlag) {
            return;
        }
        this.savingFlag = true;

        var formData = {
            title: this.editDialog.title
        };

        this.workbook.update(this.stateParams.workbook ,formData);
    }

    workbookUpdatedCallback() {
        // var workbook = parameters.response;
        this.editDialog.show = false;
        this.savingFlag  = false;
    }

    deleteWorkbookDialogOutsideClickedCallback() {
        this.deleteWorkbookDialog.show = false;
    }

    deleteWorkbookDialogDeleteEvent() {
        this.workbook.destroy(this.stateParams.workbook);
        this.state.go("workbook");
    }

    deleteWorkbookDialogClose() {
        this.deleteWorkbookDialog.show = false;
    }

    deleteWorkbook() {
        // confirm 
        this.deleteWorkbookDialog.show = true;
    }

}

export default WorkbookShowController;
