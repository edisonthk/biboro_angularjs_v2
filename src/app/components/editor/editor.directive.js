import EditorController from "./editor.controller";

class EditorDirective {
    constructor () {
        'ngInject';

        let directive = {
            restrict: 'E',
            controller: EditorController,
            controllerAs: 'editor',
            templateUrl: 'app/components/editor/editor.html',
            link: this.linkFunc.bind(this),
        };

        return directive;
    }

    linkFunc(scope, el, attr, vm) {
        scope.show = false;
        scope.mobile = false;
        if(window.innerWidth < 480) {
            scope.mobile = true;
        }
    }
}

export default EditorDirective;
