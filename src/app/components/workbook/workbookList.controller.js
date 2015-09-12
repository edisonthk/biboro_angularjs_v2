
import BaseController from "../../base/base.controller";

class WorkbookListController extends BaseController {
    constructor($state, $scope ,WorkbookService) {
        super.constructor($scope);
        this.state        = $state;
        this._scope       = $scope;
        this.workbook     = WorkbookService;
        this.createDialog = {
            show: false
        };
        this.editDialog   = {
            show: false
        };

        // register action
        // this.workbook.yeah = "bbb";
        this.workbook.registerFetchAllCallback(this.fetchAllCallback.bind(this));
        this.workbook.registerStoreCallback(this.workbookStoreCallback.bind(this));
        this.workbook.registerUpdateCallback(this.updateCallback.bind(this));

        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);

        this.initialize();
    }

    initialize() {
        this.workbook.fetchAll();

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

    workbookStoreCallback(parameters) {
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
}

export default WorkbookListController;
