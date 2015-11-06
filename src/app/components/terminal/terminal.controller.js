import KeyCode from "../shortcut/shortcut.config";
import FluxController from "../flux/flux.controller";

class TerminalController extends FluxController {
    constructor ($scope,Dispatcher, $state, $stateParams, SnippetService, WorkbookService, NewsService) {
        'ngInject';
        
        super($scope, Dispatcher);

        this.state = $state;
        this.stateParams = $stateParams;
        this.workbook = WorkbookService;
        this.snippet = SnippetService;
        this.news = NewsService;

        $scope.$watch("query", this.changeCallback.bind(this));

        this.workbookLoaded = false;
        this.registerCallbacks({
            WORKBOOK_SHOW: this.workbookShowCallback.bind(this),
        });
    }

    onkeydown(e) {
        var $input = this._scope.$input;

        var ctrlKey = (e.ctrlKey || e.metaKey);

        if(document.activeElement === $input) {
            if(e.keyCode === KeyCode.KEY_ENTER && typeof this.enterCallback === 'function') {
                this.enterCallback(this._scope.query, $input);
                return;
            }
        }else if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }else if(ctrlKey) {
            if(e.keyCode === KeyCode.KEY_A) {
                e.preventDefault();
                self.highlightText(self.getNextElement());
            }else if(e.keyCode === KeyCode.KEY_S) {
                e.preventDefault();
            }
            return;
        }
        
        if( (e.keyCode >= KeyCode.KEY_0 && e.keyCode <= KeyCode.KEY_9) || 
                (e.keyCode >= KeyCode.KEY_A && e.keyCode <= KeyCode.KEY_Z) ){
            // focus to searchbox input
            $input.focus();
        }else if( e.keyCode === KeyCode.KEY_ESC){
            // blur focus from searchbox input
            $input.blur();
        }
    }

    enterCallback(q, inputElement) {
        var self = this;
        var snippets = this.state.current.name === 'news' ? this.news.getAll() : self.snippet.getAllData();

        if(snippets.length == 1) {
            self.state.go("snippet",{snippet: snippets[0].id});
            inputElement.blur();
            return;
        }

        var move = false;
        this._scope.query = q.replace(/(^[0-9]+$|\s[0-9]+$)/, function(m) {
            var number = parseInt(m.replace(/\s/g, ""));
            

            for (var i = 0; i < snippets.length; i++) {
                if(snippets[i].index === number) {
                    self.state.go("snippet",{snippet: snippets[i].id});
                    inputElement.blur();
                    move = true;
                    return "";
                }
            }

            return m;
        });

        console.log(this._scope.query);

    }

    changeCallback(q) {

        if(this.stateParams.workbook) {
            var self = this;

            if(!q || q.length <= 0) {
                if(this.workbookLoaded) {
                    this.workbook.show(this.stateParams.workbook);    
                }
                return;
            }

            clearTimeout(self.changeTimeoutId);
            self.changeTimeoutId = setTimeout(function() {
                
                if(q.length > 1 && !q.match(/(^[0-9]+$|\s[0-9]+$)/)) {
                    self.workbook.search(self.stateParams.workbook, q);
                    self._scope.$apply();
                }

            }, 300);
            
        }else if(this.state.current.name === 'news') {

            if(!q || q.length <= 0) {
                this.news.fetchAll();
                return;
            }

            var self = this;
            clearTimeout(self.changeTimeoutId);
            self.changeTimeoutId = setTimeout(function() {
                if(q.length > 1 && !q.match(/(^[0-9]+$|\s[0-9]+$)/)) {
                    self.news.search(q);
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