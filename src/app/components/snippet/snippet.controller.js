
import SnippetStore from "./snippet.store";

class SnippetController {
    
    constructor($scope, $http, Dispatcher) {
        
        this.snippet = new SnippetStore($http,Dispatcher);
        this.snippet.registerFetchedAllCallback(this.fetchedAllCallback.bind(this));

        this.hello="loading for data...";
        

        this.initialize();
    }

    initialize() {
        this.snippet.fetchAll();
    }

    fetchedAllCallback(parameters) {
        if(parameters.success){
            this.hello = "success";
            console.log(parameters.data);
        }else{
            this.hello = "fail";
        }
    }

}

export default SnippetController;
