
class BaseController {

    constructor($scope, Dispatcher) {
        $scope.$on("$destroy", function(e) {
            ShortcutTask.clearTask();
        });

        console.log(BaseController.$inject);
    }
    
}

export default BaseController;