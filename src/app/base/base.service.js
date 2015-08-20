class BaseService {
    constructor($http, dispatcher) {
        this._dispatcher = dispatcher;
        this._http       = $http;
    }

    createCallback(apiName){
        // example: apiName=fetchedAll
        //      this.FETCHEDALL_CALLBACK = "FETCHEDALL_CALLBACK";
        //      this.registerFetchedAllCallback(callback){
        //          this._dispatcher.register(FETCHEDALL_CALLBACK, callback);
        //      }

        this[apiName.toUpperCase()+'_CALLBACK'] = apiName.toUpperCase() + '_CALLBACK';

        this['register'+apiName.charAt(0).toUpperCase()+apiName.slice(1)+'_CALLBACK'] = function(callback) {
                this._dispatcher.register(apiName.toUpperCase()+'_CALLBACK',callback);
            };
    }

    createApi(apiName, method, path, result){
        var methods = [];
        methods.get = this._http.get;
        methods.post = this._http.post;
        methods.put = this._http.put;
        methods.delete= this._http.delete;

        var merge = function (obj1, obj2) {
            if (!obj2) {
                obj2 = {};
            }
            for (var attrname in obj2) {
                if (obj2.hasOwnProperty(attrname)) {
                    obj1[attrname] = obj2[attrname];
                }
            }
        };

        createApi(apiName);

        this[apiName] = methods[method](path)
            .success(function(data){
                var obj = result.success.func(data);
                this._dispatcher.dispatch(apiName.toUpperCase()+'_CALLBACK', merge({"success":true,"result":result.success.message}, obj));
            })
            .error(function(data){
                var obj = result.error.func(data);
                this._dispatcher.dispatch(apiName.toUpperCase()+'_CALLBACK', merge({"success":true,"result":result.error.message}, obj));
            })
    }
}
