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

        var req = {
            method : self.api.account.info.method,
            url    : self.api.account.info.url,
        };

        self._http[req.method](req.url)
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

    getUser() {
        return this.account;
    }

    signOut() {
        window.location.href = this.api.account.logout;
    }

    signIn() {
        window.location.href = this.api.account.login + "?origin="+encodeURIComponent(window.location.hash.replace("#",""));
    }


}

export  default AccountService;
