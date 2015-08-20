
import BaseController from "../../base/base.controller";

class SnippetController extends BaseController{
    
    constructor($scope, $stateParams,Dispatcher, AccountService, SnippetService, RouteService) {
        this._scope       = $scope;
        this.stateParams  = $stateParams;
        this.account      = AccountService;
        this.snippet      = SnippetService;
        this.route        = RouteService;

        // register callback for all kinds of action
        this.snippet.registerFetchedAllCallback(this.fetchedAllCallback.bind(this));
        this.route.registerStateUpdatedCallback(this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

        // perform first action
        this.initialize();
    }

    initialize() {

        console.log("initialize");

        // this.snippet.fetchAll();
        this.account.fetchLoginedAccount();
    }

    stateUpdatedCallback(parameters) {
        console.log(parameters.toParams);
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
