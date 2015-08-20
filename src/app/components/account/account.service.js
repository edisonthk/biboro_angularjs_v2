class AccountService {

    constructor($http,dispatcher) {

        this.ACCOUNT_FETCHED_LOGINED_ACCOUNT = "ACCOUNT_FETCHED_LOGINED_ACCOUNT";

        this.ACCOUNT_SIGN_IN = "ACCOUNT_SIGN_IN";
        this.ACCOUNT_SIGN_OUT = "ACCOUNT_SIGN_OUT";

        this._dispatcher = dispatcher;
        this._http       = $http;

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

    fetchLoginedAccount() {
        var self = this;

        self._http.get('/api/v1/account/info/.json')
            .success(function(data){
                self.account = data;
                self._dispatcher.dispatch(self.ACCOUNT_FETCHED_LOGINED_ACCOUNT, {"success":true,"result":"success","data":self.account});
            })
            .error(function(){
                console.log("Fail to get account data");
                self._dispatcher.dispatch(self.ACCOUNT_FETCHED_LOGINED_ACCOUNT, {"success":false,"result":"fail to fetch  info."});
            });

    }

    signIn(){
        var self = this;

        self._http.get('/api/v1/account/signin/')
            .success(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_IN, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_IN, {"success":false,"result":"fail to login."});
            });
    }

    signOut(){
        var self = this;

        self._http.get('/api/v1/account/signout')
            .success(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_OUT, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.ACCOUNT_SIGN_OUT, {"success":false,"result":"fail to logout."});
            });
    }
}

AccountService.$inject = ["$http","Dispatcher"];

export  default AccountService;
