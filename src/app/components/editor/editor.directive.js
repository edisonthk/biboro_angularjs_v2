import EditorController from "./editor.controller";

class EditorDirective {
    constructor () {
        'ngInject';

        let directive = {
            restrict: 'E',
            scope: {
                type: '=',
                headline: '@',
                title: '=',
                content: '=',
                tags: '=',
                selectedWorkbook: '=',
                workbooks: '=',
                savedCallback: '&',
                cancelCallback: '&',
                quitCallback: '&'
            },
            controller: EditorController,
            controllerAs: 'editor',
            templateUrl: 'app/components/editor/editor.html',
            link: this.linkFunc,
        };

        return directive;
    }

    linkFunc(scope, el, attr, vm) {

        scope.mobile = false;
        if(window.innerWidth < 480) {
            scope.mobile = true;
        }

        var es = el[0].getElementsByClassName("text-field");
        var md = el[0].getElementsByClassName("md-parsed");

        if(es.length > 0 && md.length > 0) {
            md[0].style.height = es[0].clientHeight + "px";    
        }
        

        document.querySelector(".editor-background").addEventListener('click',function(e) {
            if(typeof scope.quitCallback === 'function') {
                scope.quitCallback();
                scope.$apply();
            }
        }, true);
    }
}

export default EditorDirective;
