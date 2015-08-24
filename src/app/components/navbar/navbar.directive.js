class NavbarDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'navbar'
    };

    return directive;
  }
}

class NavbarController {
    constructor (AccountService) {
    

        this.account        = AccountService;

        this.command = {};

        this.tags = [
                { value: 'foo', text: 'Foo' },
                { value: 'bar', text: 'Bar' },
                { value: 'beep', text: 'Beep' },
            ];
        
        // "this.creation" is avaible by directive option "bindToController: true"
        // this.relativeDate = moment(this.creationDate).fromNow();

        this.account.registerFetchedLoginedAccountCallback(this.fetchLoginAccount.bind(this));

        this.account.fetchLoginedAccount();

    }

    loadTags(query) {
        console.log(query);
        return [];
    }

    fetchLoginAccount(parameters) {
        if(parameters.result) {
            this.accountInfo = parameters.data;
            console.log(this.accountInfo);
        }else{
            this.accountInfo = null;
            console.log("fail to get");
        }
    }
}

export default NavbarDirective;
