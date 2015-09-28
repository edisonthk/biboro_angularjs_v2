
import KeyCode from "../shortcut/shortcut.config";
import ShortcutTask from "../shortcut/shortcut.task";
import TerminalController from './terminal.controller';

class TerminalDirective {

    constructor () {

        this.PLACEHOLDER = "";
        this.lastTop = 0;
        this.lastLength = 0;
        this.lastFirstContent = "";

        let directive = {
            restrict: 'E',
            scope: {
                placeholder: "=",
                enterCallback: '&',
            },
            template: [
                '<div class="terminal">',
                    '<div class="terminal-wrapper">',
                        '<i class="fa fa-search"></i>',
                        '<input class="terminal-input" type="text" placeholder="{{placeholder}}" ng-model="query">',
                    '</div>',
                '</div>'
            ].join(""),

            link: this.linkFunc.bind(this),
            controller: TerminalController,
        };

        return directive;
    }

    linkFunc(scope, el) {
        var self = this;
        var $input = el.find("input")[0];
        var $wrapper = el[0].getElementsByClassName("terminal")[0];

        window.addEventListener("scroll", function(e){
            if(window.pageYOffset > 52) {
                if($wrapper.className.indexOf("fix") < 0) {
                    $wrapper.className += " fix";
                }
            } else {
                if($wrapper.className.indexOf("fix") >= 0) {
                    $wrapper.className = $wrapper.className.replace(/\s?fix/,"");
                }
            }
            
        });

        window.addEventListener("keydown",function(e) {

            if(ShortcutTask.haveTask()) {
                ShortcutTask.cb(e);
                scope.$apply();
                return;
            }

            if(ShortcutTask.haveParallelTask()) {
                ShortcutTask.parallelCb(e);
            }


            

            var ctrlKey = (e.ctrlKey || e.metaKey);

            if($input === document.activeElement) {
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

            scope.$apply();
        }, false);
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
        
        window.scrollTo( 0, top );
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

export default TerminalDirective;
