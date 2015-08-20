
import BaseController from "../../base/base.controller";

class WorkbookController extends BaseController {
    constructor($scope,$stateParams, WorkbookService, AccountService, RouteService) {

        this._scope       = $scope;
        this.stateParams  = $stateParams;
        this.route        = RouteService;
        this.workbook     = WorkbookService;
        this.account      = AccountService;

        // register action
        this.workbook.registerFetchAllCallback(this.fetchAllCallback.bind(this));
        this.workbook.registerShowCallback(this.showCallback.bind(this));
        this.route.registerStateUpdatedCallback(this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

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
            }else {
                // workbook not found
            }
        }
    }

    fetchAllCallback(parameters) {
        
    }

    showCallback(parameters) {
        console.log(parameters);
        this.currentWorkbook = parameters.response;
    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

    stateUpdatedCallback(parameters) {
        this.currentWorkbook = null;
        // console.log(parameters);
    }
}

export default WorkbookController;
