import FluxController from "../flux/flux.controller";

class ExtensionController extends FluxController {
    constructor ($window, $scope, Dispatcher, Api ) {
        'ngInject';
        
        super($scope, Dispatcher);

        this.api = Api;
    }
}   

export default ExtensionController;