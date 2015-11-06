import FluxController from "../flux/flux.controller";

class AccountController extends FluxController{
    
    constructor($scope, Dispatcher,$http,$state, $stateParams, AccountService ) {
        'ngInject';
        
        super($scope, Dispatcher);
        this._http = $http;
        this.state = $state;
        this.account = AccountService;


        if($stateParams.action === 'signout') {
            this.signOut();
        }else {
            this.signIn();            
        }
    }

    signIn() {
        this.account.signIn();
    }

    signOut() {
        this.account.signOut();
    }


}

export default AccountController;
