
class AccountController {
    
    constructor($http,$state, $stateParams, AccountService ) {
        
        this._http = $http;
        this.state = $state;
        this.account = AccountService;

        this.account.registerSignInCallback(this.signInCallback.bind(this));
        this.account.registerSignOutCallback(this.signOutCallback.bind(this));

        this.hello   = "loading for data...";
        this.username = "";
        this.password = "";

        if($stateParams.action === 'signout') {
            this.signOut();
        }
    }

    signIn() {
        this.account.signIn();
    }

    googleSignIn() {
        this.account.googleSignIn();
    }

    signOut() {
        this.account.signOut();
    }

    signOutCallback(parameters) {
        console.log("signout");
        this.state.go("account",{action: "signin"});
        this.state.reload();
    }


    signInCallback(parameters) {
        if(parameters.success){
            this.hello = "success";
            this.account.fetchLoginedAccount(true);
            console.log(parameters.response);
        }else{
            this.hello = "fail";
        }
    }

}

export default AccountController;
