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
        };

        return directive;
    }

    linkFunc(scope, el, attr, vm) {
        setTimeout(function() {
            el.find("input")[0].focus();
        },100);
        

        document.querySelector(".dialog-background").addEventListener('click',function(e) {
            if(typeof scope.outsideClickedCallback === 'function') {
                scope.outsideClickedCallback();
                scope.$apply();
            }
        });
    }

}

export default DialogDirective;
