class AccountService {

    constructor($http,Dispatcher,Api) {
        'ngInject';
        
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
                self.setUser(data);
                self.fetchedAccountData = true;
                self._dispatcher.dispatch(self.ACCOUNT_FETCH, {"success":true,"result":"success","data":self.account});
            })
            .error(function(){
                self.account = null;
                self.fetchedAccountData = true;
                self._dispatcher.dispatch(self.ACCOUNT_FETCH, {"success":false,"result":"fail to fetch  info."});
            });

    }

    getProfileImage() {
        return this.account.profile_image;
    }

    getUserId() {
        return this.account === null ? 0 : this.account.id;
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

    setUser(data) {
        this.account = this.transformUser(data);
    }

    transformUser(account) {
        account.id = parseInt(account.id);
        account.profile_image = account === null ? null : (account.profile_image.length <= 0 ? null: account.profile_image);
        return account;
    }
}

export  default AccountService;
