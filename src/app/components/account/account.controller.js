
class AccountController {
    
    constructor($http,$state, $stateParams, AccountService ) {
        
        this._http = $http;
        this.state = $state;
        this.account = AccountService;

        // this.account.registerSignInCallback(this.signInCallback.bind(this));
        this.account.registerSignOutCallback(this.signOutCallback.bind(this));

        this.hello   = "loading for data...";
        this.username = "";
        this.password = "";

        if($stateParams.action === 'signout') {
            this.signOut();
        }else {
            this.signIn();            
        }

        window.addEventListener("message", this.signInCallback.bind(this), false);
    }

    signIn() {
        this.account.signIn();
    }

    signOut() {
        this.account.signOut();
    }

    signOutCallback(parameters) {
        
    }


    signInCallback(e) {
        console.log(e);
        // if(parameters.success){
        //     this.hello = "success";
        //     this.account.fetchLoginedAccount(true);
        //     console.log(parameters.response);
        // }else{
        //     this.hello = "fail";
        // }
    }



}

export default AccountController;
