
class RouteService {

    constructor($rootScope,Dispatcher) {
        'ngInject';

        this._dispatcher = Dispatcher;
        this._scope = $rootScope;

        this.params = {};
        this.state = {};

        this.ROUTE_UPDATED = "ROUTE_UPDATED";

        this._scope.$on('$stateChangeSuccess',this.stateUpdatedCallback.bind(this));
    }

    stateUpdatedCallback(e, toState, toParams, fromState, fromParams) {

        var params = {
            "event"      : e,
            "toState"    : toState,
            "toParams"   : toParams,
            "fromState"  : fromState,
            "fromParams" : fromParams
        };

        this.state = toState;
        this.params = toParams;

        this._dispatcher.dispatch(this.ROUTE_UPDATED, params);
    }

    getCurrentParams() {
        return this.params;
    }

    getCurrentState() {
        return this.state;
    }

}

export default RouteService;