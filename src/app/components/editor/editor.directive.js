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

        var es = el.find(".col-left");

        document.querySelector(".editor-background").addEventListener('click',function(e) {
            if(typeof scope.quitCallback === 'function') {
                scope.quitCallback();
                scope.$apply();
            }
        }, true);
    }
}

class EditorController {
    constructor ($scope, ShortcutService, Markdown) {
        this.scope = $scope;
        this.markdown = Markdown;
        this.scope.$watch("content", this.contentChangeCallback.bind(this));  

        // this.scope.$watch("selectedWorkbook", function(newVal) {
        //     console.log(newVal);
        // });
        // console.log(this.scope.selectedWorkbook);
    }

    contentChangeCallback() {
        this.htmlContent = this.markdown.parseMd(this.scope.content);
    }

    loadTags(query) {
        return [{text:"aaa"},{text:"bbb"}];
    }
}   

export default EditorDirective;
