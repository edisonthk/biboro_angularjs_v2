
import PlaygroundStore from "./playground.store";

class PlaygroundController {
    
    constructor($scope, $http,Dispatcher) {
        console.log("initialize");

        this.mystore = new PlaygroundStore($http,Dispatcher);
        this.mystore.registerGetCallback(this.getCallback.bind(this));

        this.mystore.dispatchGetAction();

        this.hello="ready";

        this._scope = $scope;
    }

    getCallback(parameters) {
        console.log("yes");
        this.hello = "yes";
        
        this._scope.$apply();
    }

}

export default PlaygroundController;
