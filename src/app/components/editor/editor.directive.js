import EditorController from "./editor.controller";

class EditorDirective {
    constructor () {

        let directive = {
            restrict: 'E',
            scope: {
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

        var es = el[0].getElementsByClassName("text-field")[0];
        var md = el[0].getElementsByClassName("md-parsed")[0];

        md.style.height = es.clientHeight + "px";

        document.querySelector(".editor-background").addEventListener('click',function(e) {
            if(typeof scope.quitCallback === 'function') {
                scope.quitCallback();
                scope.$apply();
            }
        }, true);
    }
}

export default EditorDirective;
