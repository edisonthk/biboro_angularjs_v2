class TabsDirective {
    constructor () {
        'ngInject';

        let directive = {
            restrict: 'E',
            scope: {
                ngModel: '=',
                panes: '=',
                emptyPane: '=',
                selectedCallback: '=',
            },
            template: '<pane index="0">fsdfds</pane><pane index="1">fsdfds</pane><pane index=2>fsdfds</pane>',
            link: this.linkFunc,
        };

        return directive;
    }

    linkFunc(scope, el) {

        scope.$watch("panes", function(panes) {
            var parent = el[0];
            parent.innerHTML = "";

            if(!panes) return;
            
            for (var i = 0; i < panes.length; i++) {
                var title = panes[i].title;
                var paneElement = addPane(parent, panes[i].title);

                paneElement.setAttribute("index",i);
                paneElement.addEventListener("click", function(e) {
                    var selectedPane = panes[e.target.getAttribute("index")];
                    scope.ngModel = selectedPane;
                    if(typeof scope.selectedCallback === 'function') {
                        scope.selectedCallback(selectedPane);
                    }
                    scope.$apply();
                });
            }
        });

        scope.$watch("ngModel", function(selectedPane) {
            //console.log(selectedPane);
            if(!selectedPane || !selectedPane.id) {
                return;
            }
            
            var panes = el.find("pane");
            for (var i = 0; i < panes.length; i++) {
                var index = parseInt(panes[i].getAttribute("index"));
                panes[i].className = panes[i].className.replace(/\s?active/g,"");
                if(scope.panes[index].id === selectedPane.id) {
                    panes[i].className += " active";
                }
            }
        });

        function addPane(parent, title) {
            var paneElement = document.createElement("pane");
            paneElement.innerHTML = title;
            parent.appendChild(paneElement);

            return paneElement;
        }

    }
}

export default TabsDirective;
