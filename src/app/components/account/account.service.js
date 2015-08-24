class AccountService {

    constructor($http,Dispatcher,Api) {

        this.ACCOUNT_FETCHED_LOGINED_ACCOUNT = "ACCOUNT_FETCHED_LOGINED_ACCOUNT";

        this.ACCOUNT_SIGN_IN = "ACCOUNT_SIGN_IN";
        this.ACCOUNT_SIGN_OUT = "ACCOUNT_SIGN_OUT";

        this._dispatcher = Dispatcher;
        this._http       = $http;
        this.api         = Api;

        this.fetchedAccountData = false;
        this.account = null;

    }

    registerFetchedLoginedAccountCallback(callback) {
        this._dispatcher.register(this.ACCOUNT_FETCHED_LOGINED_ACCOUNT,callback);
    }

    registerSignInCallback(callback){
        this._dispatcher.register(this.ACCOUNT_SIGN_IN, callback);
    }

    registerSignOutCallback(callback){
        this._dispatcher.register(this.ACCOUNT_SIGN_OUT, callback);
    }

    fetchLoginedAccount(forceUpdate) {
        var self = this;

        if(!forceUpdate) {
            if(self.fetchedAccountData) {
                if(self.account === null) {
                    self._dispatcher.dispatch(self.ACCOUNT_FETCHED_LOGINED_ACCOUNT, {"success":false,"result":"fail to fetch  info."});
                }else{
                    self._dispatcher.dispatch(self.ACCOUNT_FETCHED_LOGINED_ACCOUNT, {"success":true,"result":"success","data":self.account});
                }
                return;
            }
        }

        self._http.get(self.api.account.info)
            .success(function(data){
                self.account = data;
                self.fetchedAccountData = true;
                self._dispatcher.dispatch(self.ACCOUNT_FETCHED_LOGINED_ACCOUNT, {"success":true,"result":"success","data":self.account});
            })
            .error(function(){
                self.account = null;
                self.fetchedAccountData = true;
                self._dispatcher.dispatch(self.ACCOUNT_FETCHED_LOGINED_ACCOUNT, {"success":false,"result":"fail to fetch  info."});
            });

    }

    signIn(){
        var self = this;

        self._http.get(self.api.account.signin)
            .success(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_IN, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_IN, {"success":false,"result":"fail to login."});
            });
    }

    googleSignIn(){
        var self = this;

        self._http.get(self.api.account.google_signin)
            .success(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_IN, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_IN, {"success":false,"result":"fail to login."});
            });
    }

    signOut(){
        var self = this;

        self._http.get(self.api.account.signout)
            .success(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_OUT, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_OUT, {"success":false,"result":"fail to logout."});
            });
    }


}

export  default AccountService;
