
import BaseController from "../../base/base.controller";
import Markdown from "../../../../bower_components/markdown/src/markdown";

class SnippetController extends BaseController{
    
    constructor($scope, $stateParams,Dispatcher, AccountService, SnippetService, RouteService) {
        this._scope         = $scope;
        this.stateParams    = $stateParams;
        this.account        = AccountService;
        this.snippet        = SnippetService;
        this.route          = RouteService;
        this.currentSnippet = null;


        // register callback for all kinds of action
        // this.snippet.registerFetchedAllCallback(this.fetchedAllCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));
        this.snippet.registerShowCallback(this.showCallback.bind(this));

        // perform first action
        this.initialize();
    }

    initialize() {

        // this.snippet.fetchAll();
        // this.account.fetchLoginedAccount();

        // var snippet = this.stateParams.snippet;
        // if(snippet) {
        //     if(snippet.match(/^\d+$/g)) {
        //         // snippetId
        //         this.snippet.show(snippet);
        //     }
        // }

        var snippet = this.stateParams.snippet;

        if(snippet.match(/^\d+$/g)) {
            this.updateCurrentSnippet(snippet);
            // console.log(this.currentSnippet);
        }else{
            console.error("unknown snippet");
        }
    }

    showCallback(parameters) {
        var snippet = this.stateParams.snippet;

        if(snippet.match(/^\d+$/g)) {
            this.updateCurrentSnippet(snippet);
            // console.log(this.currentSnippet);
        }else{
            console.error("unknown snippet");
        }
    }

    updateCurrentSnippet(snippetId) {
        this.currentSnippet = this.snippet.getById(snippetId);
        if(this.currentSnippet != null) {
            this.currentSnippet.htmlContent = Markdown.toHTML(this.currentSnippet.content);
        }
    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

}

export default SnippetController;
