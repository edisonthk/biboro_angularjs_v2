import FluxController from "../flux/flux.controller";

class TerminalController extends FluxController {
    constructor ($scope,Dispatcher, $stateParams, WorkbookService) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.stateParams = $stateParams;
        this.workbook = WorkbookService;


        $scope.$watch("query", this.changeCallback.bind(this));

        this.workbookLoaded = false;
        this.registerCallbacks({
            WORKBOOK_SHOW: this.workbookShowCallback.bind(this),
        });
    }


    changeCallback(q) {
        if(!q || q.length <= 0) {
            // if(this.stateParams.workbook) {
            if(this.workbookLoaded) {
                this.workbook.show(this.stateParams.workbook);    
            }
                
            return;
        }

        if(this.stateParams.workbook) {
            this.workbook.search(this.stateParams.workbook, q);
        }
    }

    workbookShowCallback() {
        this.workbookLoaded = true;
    }   

}

export default TerminalController;