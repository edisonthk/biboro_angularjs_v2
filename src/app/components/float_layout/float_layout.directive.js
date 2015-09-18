class FloatLayoutDirective {
    constructor () {

        let directive = {
            restrict: 'A',
            link: this.linkFunc.bind(this),
        };

        this.index = 0;
        this.els = [];

        return directive;
    }

    linkFunc(scope, el) {

        var self = this;

        // if _index key is not set, setup element by set _index key into element
        if(!el._index) {
            el._index = self.index;
            self.els.push(el);
            self.index += 1;
        }
        
        var timeoutId = null;
        window.onresize = function() {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(function() {
                for(var j = 0; j < self.els.length; j++) {
                    self.updateCellSize(self.els[j]);    
                }
                
                scope.$apply();
            },100);
        };

        scope.$watch(el[0].clientHeight, function() {

            self.updateCellSize(el);
            
        });

        scope.$on('$destroy', function() {
            // reset everything
            self.els = [];
            self.index = 0;
        });

    }

    updateCellSize(el)
    {
        var self        = this;
        var childWidth  = el[0].clientWidth;
        var childHeight = el[0].clientHeight;
        var parentWidth = el.parent()[0].clientWidth;
        var maxCols     = parseInt( parentWidth / childWidth );
        

        if(maxCols === 0){ 
            maxCols = 1;
        }

        var leftIndex = el._index % maxCols;
        var left = leftIndex * childWidth;

        var top = 0;
        for (var i = 0; i < parseInt(el._index / maxCols); i++) {

            var elementAboveIndex = (i * maxCols) + leftIndex;
            var elementAbove = self.getElementByIndex(elementAboveIndex);
            top += elementAbove[0].clientHeight;
        }

        el.css("top",top + "px");
        el.css("left", left + "px");
    }

    checkIfRequiredReset()
    {
        var self = this;
        var firstKeyFound = false;
        console.log(self.els.length);
        for (var i = 0; i < self.els.length; i++) {
            if(self.els[i] && self.els[i]._index === 0) {
                firstKeyFound = true;
                break;
            }
        }

        return !firstKeyFound;
    }

    getElementByIndex(index)
    {
        
        for (var j = 0; j < this.els.length; j++) {
            if(this.els[j]._index === index) {
                return this.els[j];
            }
        }
        return null;
    }
}

export default FloatLayoutDirective;