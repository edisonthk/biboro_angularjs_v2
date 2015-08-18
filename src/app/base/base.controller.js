class BaseController {

    constructor($scope) {

        this.initialize();

        $scope.$on("$destroy", function() {
            console.log("controller is destroy");
        });

        console.debug("BaseController constructed");
    }
}

BaseController.$inject = ["$scope"];

export default BaseController;