// definition of terms
// groupData = group = multiple data = data in array 
// data = single data
// focusData which data is focus

class FluxService {
    
    constructor($http, Dispatcher, $cacheFactory) {
        'ngInject';

        this._http = $http;
        this._dispatcher = Dispatcher;

        if($cacheFactory) {
            this._cache = $cacheFactory("fluxCache");    
        }
        

        this.key = {};
        this.groupData = [];
        this.focusData = null;
    }

    setDispatcherKey(keys) {
        for (var i = 0; i < keys.length; i++) {
            this.key[keys[i]] = keys[i];
        }
    }

    request(config) {
        var self= this;

        if(typeof config.success === 'function') {
            config.success = config.success.bind(self);    
        }
        if(typeof config.error === 'function') {
            config.error   = config.error.bind(self);
        }
        
        

        // self.throwIfDispatcherKeyNotSet(config.dispatcher);

        self._http[config.method](config.url, config.data)
            .success(function(res) {

                if(typeof config.success === 'function') {
                    config.success(res);
                }

                if(Array.isArray(config.dispatcher)) {
                    for (var i = 0; i < config.dispatcher.length; i++) {
                        self._dispatcher.dispatch(config.dispatcher[i], {"success":true,"response":res});
                    }
                }else {
                    self._dispatcher.dispatch(config.dispatcher, {"success":true,"response":res});
                }
                
            })
            .error(function(err){

                if(typeof config.error === 'function') {
                    config.error(err);
                }

                if(Array.isArray(config.dispatcher)) {
                    for (var i = 0; i < config.dispatcher.length; i++) {
                        self._dispatcher.dispatch(config.dispatcher[i], {"success":false, "error":err});
                    }
                }else {
                    self._dispatcher.dispatch(config.dispatcher, {"success":false, "error":err});
                }
            });

    }

    throwIfDispatcherKeyNotSet(dispatcherKey) {
        if(Array.isArray(dispatcherKey)) {
            for (var j = 0; j < dispatcherKey.length; j++) {
                this.throwIfDispatcherKeyNotSet(dispatcherKey[j]);
            }
        } else {
            var found = false;
            for(var key in this.key) {
                if(dispatcherKey === key) {
                    found = true;
                    break;
                }
            }
            
            if(!found) {
                throw "There are not such dispatcher key \""+dispatcherKey+"\" in "+this.constructor.name;
            }
        }
    }

    getFocusData() {
        return this.focusData;
    }

    getAllData() {
        return this.groupData;
    }

    getDataById(dataId) {
        dataId = parseInt(dataId);
        for (var i = 0; i < this.groupData.length; i++) {
            if(this.groupData[i].id === dataId) {
                return this.groupData[i];
            }
        }
        return null;
    }

    setGroup(group) {
        for (var i = 0; i < group.length; i++) {
            group[i] = this.transformData(group[i]);
        }
        this.groupData = group;
    }

    setDataInsideGroup(data) {

        data = this.transformData(data);
        if(this.focusData && data.id === this.focusData.id) {
            this.setFocusData(data);
        }
        
        for (var i = 0; i < this.groupData.length; i++) {
            if(this.groupData[i].id === data.id) {
                for(var key in data) {
                    this.groupData[i][key] = data[key];
                }
                return;
            }
        }
    }

    appendData(data) {
        this.groupData.push(this.transformData(data));
    }

    disposeDataById(dataId) {
        dataId = parseInt(dataId);
        if(this.focusData && dataId === this.focusData.id) {
            this.disposeFocusData();
        }

        for (var i = 0; i < this.groupData.length; i++) {
            if(this.groupData[i].id === dataId) {
                this.groupData.splice(i,1);
                return;
            }
        }
    }

    setFocusData(data) {
        if(this.focusData === null) {
            this.focusData = {};
        }
        for(var key in data) {
            this.focusData[key] = data[key];
        }
    }

    disposeFocusData() {
        this.focusData = null;
    }

    transformData(data) {
        data.id = parseInt(data.id);
        return data;
    }
}

export default FluxService;