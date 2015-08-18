
import PlaygroundStore from "./playground.store";

class PlaygroundController {
    
    constructor($scope, Dispatcher) {
        console.log("initialize");

        this.mystore = new PlaygroundStore(Dispatcher);
        this.mystore.registerGetCallback(this.getPayload.bind(this));

        this.mystore.dispatchGetAction();

        this.hello="ready";

        this._scope = $scope;
    }

    getPayload(parameters) {
        console.log("yes");
        this.hello = "yes";
        
        this._scope.$apply();
    }

}

export default PlaygroundController;
