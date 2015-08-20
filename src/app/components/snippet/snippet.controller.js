
import BaseController from "../../base/base.controller";

class SnippetController extends BaseController{
    
    constructor($scope, $http, $stateParams,Dispatcher, AccountService, SnippetService) {
        this._scope       = $scope;
        this._http        = $http;
        this._stateParams = $stateParams;
        this.account      = AccountService;
        this.snippet      = SnippetService;

        // register callback for all kinds of action
        this.snippet.registerFetchedAllCallback(this.fetchedAllCallback.bind(this));
        
        this.registerStateUpdatedCallback(this._scope, this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

        // perform first action
        this.initialize();
    }

    initialize() {
        this.snippet.fetchAll();
        this.account.fetchLoginedAccount();
    }

    stateUpdatedCallback(event, toState, toParams, fromState, fromParams) {
        console.log(toParams);
    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

    fetchedAllCallback(parameters) {
        if(parameters.success){
            this.hello = "success";
        }else{
            this.hello = "fail";
        }
    }

}

export default SnippetController;
