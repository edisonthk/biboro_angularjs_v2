class CellDirective {
    constructor () {

        let directive = {
            restrict: 'C',
            link: this.linkFunc.bind(this),
        };

        this.index = 0;
        this.els = [];

        return directive;
    }

    linkFunc(scope, el, attrs) {
        scope.el = el;
        if(!Array.isArray(scope.$parent.cells)) {
            scope.$parent.cells = [];
        }
        scope.$parent.cells.push(scope);
    }
}

export default CellDirective;