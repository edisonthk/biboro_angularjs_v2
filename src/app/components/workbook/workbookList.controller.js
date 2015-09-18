import FluxController from "../flux/flux.controller";

class WorkbookListController extends FluxController {
    constructor($state, $scope ,Dispatcher,WorkbookService, AccountService, ShortcutService) {
        super.constructor($scope, Dispatcher);
        
        this.state        = $state;
        this.workbook     = WorkbookService;
        this.account      = AccountService;
        this.createDialog = {
            show: false
        };
        this.editDialog   = {
            show: false
        };

        // register action
        this.registerCallbacks({
            WORKBOOK_FETCHALL  : this.fetchAllCallback,
            WORKBOOK_STORE     : this.storeCallback,
            WORKBOOK_UPDATE    : this.updateCallback,
        });

        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);

        this.initialize();
    }

    initialize() {
        this.workbook.fetchAll();

        this.account.fetchLoginedAccount();

        this.workbooks = [];
        this.currentWorkbook = null;

    }

    testClick() {
        this.showCreateDialog();
    }

    fetchAllCallback(parameters) {
        this.workbooks = parameters.response;

        // set default value of workbook
        // this.editor.workbook = this.workbooks.length > 0 ? this.workbooks[0] : null;
    }

    /**
     *  create workbook
     */
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

    storeCallback(parameters) {
        if(parameters.result) {
            var workbook = parameters.response;
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
}

export default WorkbookListController;
