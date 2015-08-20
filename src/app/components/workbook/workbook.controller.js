
class WorkbookController {
    constructor(WorkbookService, AccountService) {

        this.workbook = WorkbookService;
        this.account  = AccountService;
        this.workbook.registerFetchAllCallback(this.fetchedAllCallback.bind(this));
    }

    initialize() {
        this.workbook.fetchAll();
        this.account.fetchLoginedAccount();
    }

    fetchedAllCallback(parameters) {
        console.log(parameters);
    }
}

export default WorkbookController;
