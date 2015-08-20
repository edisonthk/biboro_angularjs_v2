
import BaseController from "../../base/base.controller";

class WorkbookController extends BaseController {
    constructor($scope, WorkbookService, AccountService) {

        this._scope = $scope;

        this.workbook = WorkbookService;
        this.account  = AccountService;
        
        // register action
        this.workbook.registerFetchAllCallback(this.fetchAllCallback.bind(this));
        
        this.registerStateUpdatedCallback(this._scope, this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

        this.initialize();
    }

    initialize() {
        this.workbook.fetchAll();
        this.account.fetchLoginedAccount();
    }

    fetchAllCallback(parameters) {
        this.workbooks = parameters.response;
    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

    stateUpdatedCallback(event, toState, toParams, fromState, fromParams) {
        console.log(toParams);
    }
}

export default WorkbookController;
