class CellsDirective {
    constructor () {
        'ngInject';

        let directive = {
            restrict: 'C',
            link: this.linkFunc.bind(this),
        };

        this.index = 0;
        this.els = [];

        return directive;
    }

    linkFunc(scope, el) {

        var self = this;

        scope.cells = [];
        self.scope = scope;
        self.timeoutId = null;

        scope.$watchCollection("cells", function(cells) {
            self.updateCells();
        });

        

        // // if _index key is not set, setup element by set _index key into element
        // if(!el._index) {
        //     el._index = self.index;
        //     self.els.push(el);
        //     self.index += 1;
        // }

        
        window.onresize = function() {
            self.updateCells();
        };

        scope.$watch(el[0].clientHeight, function() {
            self.updateCells();
        });

        // scope.$on('$destroy', function() {
        //     // reset everything
        //     self.scope.cells = [];
        //     self.index = 0;
        // });

    }

    updateCells() 
    {
        console.log("b");
        var self = this;
        clearTimeout(self.timeoutId);
        self.timeoutId = setTimeout(function() {
            self.els = [];
            self.nextIndex = -1;

            angular.forEach(self.scope.cells, function(cell, index) {
                cell.el._index = index;
                if(cell.el.parent().length <= 0) {
                    cell.$destroy();
                    return;
                }
                self.updateCellSize(cell.el);    
                
            });

            self.updatedCallback
            self.scope.$apply();
            console.log("c");

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

        
        var colHeight = 0;
        var nextColHeight = 0;
        var tolerantHeight = 100;

        var lastIndex = self.nextIndex;

        for (var c = 0; c < maxCols; c++) {

            self.nextIndex += 1;
            if(self.nextIndex >= maxCols) {
                self.nextIndex = 0;
            }

            colHeight     = self.getColHeight(self.nextIndex);
            if(colHeight === 0 || self.getColHeight(lastIndex) >= colHeight) {
                el._colIndex = self.nextIndex;
                if(el._colIndex == maxCols - 1) {
                    if(el[0].className.indexOf("mostleft") < 0) {
                        el[0].className += " mostleft";
                    }
                }else {
                    el[0].className = el[0].className.replace(/\s?mostleft/g,"");
                }
                self.els.push(el);
                break;
            }

            lastIndex += 1;
            if(lastIndex >= maxCols) {
                lastIndex = 0;
            }
        }
        
        
        var left = el._colIndex * childWidth;

        el.css("top",colHeight + "px");
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

    getColHeight(index)
    {
        var height = 0;
        for (var j = 0; j < this.els.length; j++) {
            if(this.els[j]._colIndex === index) {
                height += this.els[j][0].clientHeight
            }
        }
        return height;   
    }

    getElementsInCol(index) 
    {
        var elsInCol = [];
        for (var j = 0; j < this.els.length; j++) {
            if(this.els[j]._colIndex === index) {
                elsInCol.push(this.els[j]);
            }
        }
        return elsInCol;   
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

export default CellsDirective;