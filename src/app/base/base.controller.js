
class BaseController {
    
    registerStateUpdatedCallback($scope,cb) {
        $scope.$on('$stateChangeSuccess',cb);
    }



}

export default BaseController;