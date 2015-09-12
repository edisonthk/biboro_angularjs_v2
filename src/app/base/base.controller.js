
class BaseController {

    constructor($scope, Dispatcher) {
        $scope.$on("$destroy", function(e) {
            console.log(e);
        });

        console.log(BaseController.$inject);
    }
    
}

export default BaseController;