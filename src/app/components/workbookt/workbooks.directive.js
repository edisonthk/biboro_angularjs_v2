class WorkbooksDirective {
    constructor () {
        'ngInject';
        console.log("ffsdfs");

        return {    
            restrict: 'E',
            templateUrl: 'app/components/workbookt/workbooks.directive.html',
            controller: WorkbookDirectiveController,
            controllerAs: 'workbook',
            bindToController: true
        };
    }
}

class WorkbookDirectiveController {
    constructor ($log) {
        this.workbooks = ["a","b","c","d"];

        $log.info("dafds");
    }
}

WorkbookDirectiveController.$inject = ["$log"];

export default WorkbooksDirective;
