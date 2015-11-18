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
            WORKBOOK_SHOW: this.workbookShowCallback,
            WORKBOOK_FETCHALL: this.workbookFetchAllCallback,
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
                this.highlightText(this.getNextElement());
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
        if(this.state.current.name === 'workbook') {
            var wbs = self.workbook.getAllData();
            if(wbs.length === 1) {
                self.workbook.restoreBackup();
                self._scope.query = "";
                self.state.go("workbookShow",{workbook: wbs[0].id}); 
                inputElement.blur();
                return;
            }

            // only workbookList
            if(q.length < 1) {
                return;
            }

            this._scope.query = q.replace(/(^[0-9]+$|\s[0-9]+$)/, function(m) {
                var number = parseInt(m.replace(/\s/g, ""));
                if(typeof wbs[number - 1] === 'undefined') {
                    return;
                }

                self.workbook.restoreBackup();
                self.state.go("workbookShow",{workbook: wbs[number - 1].id}); 
                inputElement.blur();


                return "";
            });

        }else {
            // news & workbookShow
            var snippets = this.state.current.name === 'news' ? this.news.getAll() : self.snippet.getAllData();

            if(snippets.length === 1) {
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

        }
    }

    changeCallback(q) {
        var self = this;

        if(this.stateParams.workbook) {

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

            clearTimeout(self.changeTimeoutId);
            self.changeTimeoutId = setTimeout(function() {
                if(q.length > 1 && !q.match(/(^[0-9]+$|\s[0-9]+$)/)) {
                    self.news.search(q);
                    self._scope.$apply();
                }
            }, 300);
        }else if(this.state.current.name === 'workbook') {

            if(!q || q.length <= 0) {
                this.workbook.restoreBackup();
                return;
            }


            if(q.match(/(^[0-9]+$|\s[0-9]+$)/)) {
                return;
            }

            var wbs = this.workbook.getBackup();
            var result = [];
            for (var i = 0; i < wbs.length; i++) {
                if(wbs[i].title.indexOf(q) >= 0) {
                    result.push(wbs[i]);
                }
            }

            this.workbook.setWorkbooks(result);
        }
    }

    workbookFetchAllCallback() {
        this.workbook.updateBackup();
    }

    workbookShowCallback() {
        this.workbookLoaded = true;
    }   

    getNextElement() {
        var self = this;

        var els = document.getElementsByClassName("prettyprint");
        if(els.length <= 0) {
            return null;
        }

        if( self.lastLength != els.length || (els.length > 0 && els[0].innerHTML != self.lastFirstContent)) {
            self.lastFirstContent = els[0].innerHTML;
            self.lastLength = els.length;
            self.lastTop = 0;
        }

        var resetFlag = true,
            tempOffsetTop = 0,
            tempMinIndex = 0,
            tempMinDiff = 3000000  // infinity big 
        ;
        
        for (var i = 0; i < els.length; i++) {
            var offsetTop = self.getOffsetTop(els[i]);
            var diff = offsetTop - self.lastTop;
            if(diff < tempMinDiff && diff > 0) {
                tempMinDiff = diff;
                tempMinIndex = i;
                tempOffsetTop = offsetTop;
                resetFlag = false;
            }
        }

        if(resetFlag) {
            self.lastTop = 0;
            return self.getNextElement();
        }
        
        self.lastTop = tempOffsetTop;

        return els[tempMinIndex];
    }

    highlightText(element) {     
        if(!element) {
            return;
        }

        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        // scrollTo
        var cell = element;
        
        if(this.isVisible(cell)) {
            return;
        }
        
        var top = this.getOffsetTop(cell);
        
        window.scrollTo( 0, top + 100 );
    }

    getOffsetTop(cell) {
        var top = 0; // navbar height
        for(var i = 0 ; i < 4; i ++) {
            top += cell.offsetTop;
            cell = cell.parentElement;
        }
        return top;
    }

    isVisible(el) {   
        var elRect = el.getBoundingClientRect();
        
        return (elRect.top > 50 && elRect.top < window.innerHeight) &&
            (elRect.bottom > 50 && elRect.bottom < window.innerHeight)
        ;
    }

}

export default TerminalController;