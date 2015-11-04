
class HoverDirective {

    constructor (Viewport) {
        'ngInject';

        var provider = function(el) {
            console.log(el);
        };

        return  {
            restrict: 'A',
            scope: {
                hover: '=',
            },
            link: function(scope, el) {

                if(window.innerWidth < 480) {
                    // var moreDiv = el[0].getElementsByClassName("more");
                    // if(moreDiv.length > 0) {
                    //     Viewport.setOnViewport(moreDiv[0], provider);
                    // }
                    
                    scope.hover = true;

                }else {
                    el.bind('mouseenter', function() {
                        scope.hover = true;
                        scope.$apply();
                    });

                    el.bind('mouseleave', function(){
                        scope.hover = false;   
                        scope.$apply();
                    });

                }
            },
        };
    }
    
}

export default HoverDirective;
