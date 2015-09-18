import ShortcutTask from "../shortcut/shortcut.task";

class FluxController {
    constructor($scope, Dispatcher) {
        this._scope = $scope;
        this._dispatcher = Dispatcher;

        this._scope.$on("$destroy", this.onDestruct.bind(this));

        this.dispatchToken = [];
    }

    registerCallbacks(callbacks) {
        for(var storeType in callbacks) {
            
            this._scope[storeType] = {
                _callback: callbacks[storeType]
            };
            
            var dispatchToken = this._dispatcher.register(storeType,this._scope[storeType]._callback.bind(this));
            this.dispatchToken.push(dispatchToken);
        }
    }

    onDestruct() {

        ShortcutTask.clearTask(this._shortcutTaskToken);
        ShortcutTask.clearParallelTask(this._shortcutParallelTaskToken);

        this._dispatcher.detach(this.dispatchToken);
    }
}

export default FluxController;