import ShortcutTask from "../shortcut/shortcut.task";
import KeyCode from "../shortcut/shortcut.config";
import FluxController from "../flux/flux.controller";


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

class EditorController extends FluxController {
    constructor ($scope, ShortcutService, Markdown, Dispatcher) {
        super.constructor($scope,Dispatcher);
        this.scope = $scope;
        this.markdown = Markdown;
        this.scope.$watch("content", this.contentChangeCallback.bind(this));  

        // this.scope.$watch("selectedWorkbook", function(newVal) {
        //     console.log(newVal);
        // });
        // console.log(this.scope.selectedWorkbook);
        
        var el_fo = document.getElementsByClassName("editor-ready-focus");
        if(el_fo.length > 0) {
            el_fo[0].focus();
        }

        this._shortcutTaskToken = ShortcutTask.setTask(this.keyupTask.bind(this));
    }

    keyupTask(e) {
        var ctrlKey = (e.ctrlKey || e.metaKey);
        if(ctrlKey && e.keyCode === KeyCode.KEY_S) {
            e.preventDefault();
            this.scope.savedCallback();
        }else if(e.keyCode === KeyCode.KEY_ESC) {
            e.preventDefault();
            this.scope.cancelCallback();
        }
        
    }

    contentChangeCallback() {
        this.htmlContent = this.markdown.parseMd(this.scope.content);
    }

    loadTags(query) {
        return [{text:"aaa"},{text:"bbb"}];
    }
}   

export default EditorDirective;
