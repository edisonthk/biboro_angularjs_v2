
import BaseController from "../../base/base.controller";

class WorkbookController extends BaseController {
    constructor($scope ,$state ,$stateParams ,WorkbookService, AccountService, RouteService) {
        this._scope       = $scope;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.route        = RouteService;
        this.workbook     = WorkbookService;
        this.account      = AccountService;

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
        this.route.registerStateUpdatedCallback(this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);

        this.initialize();
    }

    initialize() {
        this.workbook.fetchAll();
        this.account.fetchLoginedAccount();

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
        
    }

    showMyCallback(parameters) {
        console.log(parameters);
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
        console.log(parameters);
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
        if(parameters.result) {
            var workbook = parameters.response;
            this.state.go("workbook.show",{workbook: workbook.id});
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

    editDialogRenameWorkbookTitleEvent() {
        var formData = {
            title: this.editDialog.title
        };

        this.workbook.rename(this.stateParams.workbook ,formData);
    }
}

export default WorkbookController;
