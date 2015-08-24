class BaseService {
    
    createCallback(apiName){
        // example: apiName=fetchedAll
        //      this.FETCHEDALL_CALLBACK = "FETCHEDALL_CALLBACK";
        //      this.registerFetchedAllCallback(callback){
        //          this._dispatcher.register(FETCHEDALL_CALLBACK, callback);
        //      }

        var self = this;
        self[apiName.toUpperCase()+'_CALLBACK'] = apiName.toUpperCase() + '_CALLBACK';



        self['register'+apiName.charAt(0).toUpperCase()+apiName.slice(1)+'Callback'] = function(callback) {
                self._dispatcher.register(apiName.toUpperCase()+'_CALLBACK',callback);
            };
    }

    createApi(apiName, method, path, result){
        var methods = [],
            self = this;

        methods.get    = self._http.get;
        methods.post   = self._http.post;
        methods.put    = self._http.put;
        methods.delete = self._http.delete;

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

        this.createCallback(apiName);

        self[apiName] = methods[method](path)
            .success(function(data){
                var obj = result.success.func(data);
                self._dispatcher.dispatch(apiName.toUpperCase()+'_CALLBACK', merge({"success":true,"result":result.success.message}, obj));
            })
            .error(function(data){
                var obj = result.error.func(data);
                self._dispatcher.dispatch(apiName.toUpperCase()+'_CALLBACK', merge({"success":true,"result":result.error.message}, obj));
            })
    }
}

export default BaseService;