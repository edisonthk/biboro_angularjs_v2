import FluxController from "../flux/flux.controller";

class TerminalController extends FluxController {
    constructor ($scope,Dispatcher, $state, $stateParams, SnippetService, WorkbookService) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.state = $state;
        this.stateParams = $stateParams;
        this.workbook = WorkbookService;
        this.snippet = SnippetService;

        $scope.$watch("query", this.changeCallback.bind(this));

        $scope.enterCallback = this.enterCallback.bind(this);

        this.workbookLoaded = false;
        this.registerCallbacks({
            WORKBOOK_SHOW: this.workbookShowCallback.bind(this),
        });
    }

    enterCallback(q, inputElement) {
        var self = this;
        var snippets = self.snippet.getAllData();

        if(snippets.length == 1) {
            self.state.go("snippet",{snippet: snippets[0].id});
            inputElement.blur();
            return;
        }

        q.replace(/(^[0-9]+$|\s[0-9]+$)/, function(m) {
            var number = parseInt(m.replace(/\s/g, ""));
            

            for (var i = 0; i < snippets.length; i++) {
                if(snippets[i].index === number) {
                    self.state.go("snippet",{snippet: snippets[i].id});
                    inputElement.blur();
                    break;
                }
            }
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
            var self = this;
            clearTimeout(self.changeTimeoutId);
            self.changeTimeoutId = setTimeout(function() {
                
                if(q.length > 1 && !q.match(/(^[0-9]+$|\s[0-9]+$)/)) {
                    self.workbook.search(self.stateParams.workbook, q);
                    self._scope.$apply();
                }

            }, 300);
            
        }
    }

    workbookShowCallback() {
        this.workbookLoaded = true;
    }   

}

export default TerminalController;