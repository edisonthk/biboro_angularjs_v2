import ShortcutTask from '../shortcut/shortcut.task';
import TerminalController from './terminal.controller';

class TerminalDirective {

    constructor () {
        'ngInject';

        this.PLACEHOLDER = "";
        this.lastTop = 0;
        this.lastLength = 0;
        this.lastFirstContent = "";
        this.requiredApply = false;

        let directive = {
            restrict: 'E',
            scope: {
                placeholder: "=",
                enterCallback: '&',
            },
            template: [
                '<div class="terminal">',
                    '<div class="terminal-wrapper">',
                        '<img class="animation" src="assets/images/ic_logo_fadeout.gif">',
                        '<a ui-sref="workbook" class="link hide"></a>',
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

    intervalEvent() {
        
    }

    linkFunc(scope, el) {
        var self = this;
        var $wrapper = el[0].getElementsByClassName("terminal")[0];

        var iconAnimation = el[0].getElementsByClassName("animation")[0];
        var iconLink = el[0].getElementsByClassName("link")[0];
        
        scope.$input = el.find("input")[0];

        var addClass = function(element, className) {
            if(element.className.indexOf(className) < 0) {
                element.className += " "+className;
            }
        }

        
        var removeClass = function(element, className) {
            if(element.className.indexOf(className) >= 0) {
                var regex = new RegExp("\s?"+className);
                element.className = element.className.replace(regex,"");
            }
        }

        var changeImageSrc = function(src) {
            if(iconAnimation.src.indexOf(src) >= 0) {
                return;
            }
            iconAnimation.src = src;
        }

        window.addEventListener("scroll", function(e){
            if(window.pageYOffset > 52) {
                addClass($wrapper, "fix");
                removeClass(iconLink, "hide");
                changeImageSrc("assets/images/ic_logo_fadein.gif");
            } else {
                removeClass($wrapper, "fix");
                addClass(iconLink, "hide");
                changeImageSrc("assets/images/ic_logo_fadeout.gif");
                // iconAnimation.src = "assets/images/ic_logo_fadeout.gif";
            }
            
        });

        // window.addEventListener("keydown",function(e) {
        //     if(ShortcutTask.haveTask()) {
        //         if(ShortcutTask.cb(e)) {
        //             e.preventDefault();
        //             scope.$apply();    
        //         }
        //         return;
        //     }

        //     if(ShortcutTask.haveParallelTask()) {
        //         ShortcutTask.parallelCb(e);
        //         scope.$apply();
        //     }

        //     var ctrlKey = (e.ctrlKey || e.metaKey);

        //     if(document.activeElement === $input) {
        //         if(e.keyCode === KeyCode.KEY_ENTER && typeof scope.enterCallback === 'function') {
        //             scope.enterCallback(scope.query, $input);
        //             return;
        //         }
        //     }else if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        //         return;
        //     }else if(ctrlKey) {
        //         if(e.keyCode === KeyCode.KEY_A) {
        //             e.preventDefault();
        //             self.highlightText(self.getNextElement());
        //         }else if(e.keyCode === KeyCode.KEY_S) {
        //             e.preventDefault();
        //         }
        //         return;
        //     }
            
        //     if( (e.keyCode >= KeyCode.KEY_0 && e.keyCode <= KeyCode.KEY_9) || 
        //             (e.keyCode >= KeyCode.KEY_A && e.keyCode <= KeyCode.KEY_Z) ){
        //         // focus to searchbox input
        //         $input.focus();
        //     }else if( e.keyCode === KeyCode.KEY_ESC){
        //         // blur focus from searchbox input
        //         $input.blur();
        //     }

        // }, false);
    }     

}

export default TerminalDirective;
