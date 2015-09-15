class AccountService {

    constructor($http,Dispatcher,Api) {
        
        this.ACCOUNT_FETCH = "ACCOUNT_FETCH";
        
        this._dispatcher = Dispatcher;
        this._http       = $http;
        this.api         = Api;

        this.fetchedAccountData = false;
        this.account = null;

    }

    fetchLoginedAccount(forceUpdate) {
        var self = this;

        if(!forceUpdate) {
            if(self.fetchedAccountData) {
                if(self.account === null) {
                    self._dispatcher.dispatch(self.ACCOUNT_FETCH, {"success":false,"result":"fail to fetch  info."});
                }else{
                    self._dispatcher.dispatch(self.ACCOUNT_FETCH, {"success":true,"result":"success","data":self.account});
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
                self._dispatcher.dispatch(self.ACCOUNT_FETCH, {"success":true,"result":"success","data":self.account});
            })
            .error(function(){
                self.account = null;
                self.fetchedAccountData = true;
                self._dispatcher.dispatch(self.ACCOUNT_FETCH, {"success":false,"result":"fail to fetch  info."});
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
