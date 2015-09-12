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
        
    }     

}

export default TerminalDirective;
