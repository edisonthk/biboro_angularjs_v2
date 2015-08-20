class WorkbookService extends BaseService{
    constructor($http,dispatcher) {
        super($http,dispatcher);

        var obj = {
            "success":{
                "func":function(data){

                },
                "message":"success"
            },
            "error":{
                "message":"fail to fetchworkbooks."
            }
        }
        super.createApi('fetchAll', 'get', '/api/v1/workbook/index.json', obj);
    }
}

WorkbookService.$inject = ["$http", "Dispatcher"];

export default WorkbookService;
