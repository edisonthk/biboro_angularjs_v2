import KeyCode from "../shortcut/shortcut.config";
// import TerminalController   from 'terminal.controller';

class TerminalDirective {

    constructor () {

        this.PLACEHOLDER = "";

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
        };

        return directive;
    }

    linkFunc(scope, el) {
        var $input = el.find("input")[0];

        window.onkeydown = function(e) {
            var ctrlKey = (e.ctrlKey || e.metaKey);

            if(ctrlKey) {
                return;
            }

            if($input === document.activeElement) {
                
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
    }     

}

export default TerminalDirective;
