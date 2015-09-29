import FluxController from "../flux/flux.controller";
import ShortcutTask from "../shortcut/shortcut.task";

class DialogDirective {

    constructor () {
        'ngInject';

        let directive = {
            restrict: 'E',
            scope: {
                title: '=',
                message: '=',
                outsideClickedCallback: '=',
            },
            transclude: true, 
            template: 
                '<div class="dialog-background"></div>'+
                '<div class="dialog-box">'+
                    '<div class="dialog-message">'+
                        '<h3 ng-bind-html="title"></h3>'+
                        '<p ng-bind-html="message"></p>'+
                    '</div>'+
                    '<ng-transclude></ng-transclude>' +
                '</div>',
            link: this.linkFunc,
            controller: DialogController
        };

        return directive;
    }

    linkFunc(scope, el) {
        setTimeout(function() {
            if(el.find("input")[0]){
                el.find("input")[0].focus();
            }
        },100);

        document.querySelector(".dialog-background").addEventListener('click',function() {
            if(typeof scope.outsideClickedCallback === 'function') {
                scope.outsideClickedCallback();
                scope.$apply();
            }

        });
    }

}

class DialogController extends FluxController {

    constructor ($scope,Dispatcher) {
        super.constructor($scope, Dispatcher);
        console.log("ff");
        this._shortcutTaskToken = ShortcutTask.setTask(this.keyupTask.bind(this));
    }

    keyupTask(e) {
        
    }
}

export default DialogDirective;
