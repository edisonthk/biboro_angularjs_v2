
import SnippetStore from "./snippet.store";

class SnippetController {
    
    constructor($scope, $http, Dispatcher) {
        console.log("initialize");

        this.snippet = new SnippetStore($http,Dispatcher);
        this.snippet.registerFetchedAllCallback(this.fetchedAllCallback.bind(this));

        

        this.hello="loading for data...";

        this._scope = $scope;

        start();
    }

    start() {
        this.snippet.fetchAll();
    }

    fetchedAllCallback(parameters) {
        if(parameters.success){
            console.log(parameters.data);
        }else{
            this.hello = "fail";
        }
        
        
        this._scope.$apply();
    }

}

export default SnippetController;
