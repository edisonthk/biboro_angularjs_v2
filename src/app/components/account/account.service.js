import FluxService from "../flux/flux.service";

class AccountService extends FluxService{

    constructor($http,Dispatcher, Api) {
        'ngInject';

        super.constructor($http, Dispatcher);
        
        this.api = Api;

        this.setDispatcherKey([
                "ACCOUNT_FETCH",
            ]);

        this.account = null;

    }

    fetchLoginedAccount() {
        var self = this;

        this.request({
            method : this.api.account.info.method,
            url    : this.api.account.info.url,
            dispatcher: "ACCOUNT_FETCH",
            success: function(res) {
                this.setUser(res);
            }
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
        window.location.href = this.api.account.login + "?origin="+encodeURIComponent(window.location.pathname);
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
