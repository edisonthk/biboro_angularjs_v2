import BaseService from "../../base/base.service";

class WorkbookService extends BaseService{
    constructor($http,dispatcher) {
        super($http,dispatcher);

        
    }
}

WorkbookService.$inject = ["$http", "Dispatcher"];

export default WorkbookService;
