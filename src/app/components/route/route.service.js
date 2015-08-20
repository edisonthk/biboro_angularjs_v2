
class RouteService {

    constructor($rootScope,Dispatcher) {

        this._dispatcher = Dispatcher;
        this._scope = $rootScope;

        this.ROUTE_UPDATED_CALLBACK = "ROUTE_UPDATED_CALLBACK";

        this._scope.$on('$stateChangeSuccess',this.stateUpdatedCallback.bind(this));
    }

    registerStateUpdatedCallback(cb) {
        this._dispatcher.register(this.ROUTE_UPDATED_CALLBACK,cb);
    }

    stateUpdatedCallback(e, toState, toParams, fromState, fromParams) {

        var params = {
            "event"      : e,
            "toState"    : toState,
            "toParams"   : toParams,
            "fromState"  : fromState,
            "fromParams" : fromParams
        };

        this._dispatcher.dispatch(this.ROUTE_UPDATED_CALLBACK, params);
    }

}

export default RouteService;