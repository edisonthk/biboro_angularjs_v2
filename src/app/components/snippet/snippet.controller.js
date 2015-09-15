
import FluxController from "../flux/flux.controller";
import Markdown from "../../../../bower_components/marked/lib/marked";

class SnippetController extends FluxController {
    
    constructor($scope, $state,$stateParams,Dispatcher, WorkbookService, AccountService, SnippetService, RouteService, ShortcutService) {
        super.constructor($scope, Dispatcher);

        this._scope         = $scope;
        this.state          = $state;
        this.stateParams    = $stateParams;
        this.workbook       = WorkbookService;
        this.account        = AccountService;
        this.snippet        = SnippetService;
        this.route          = RouteService;
        this.currentSnippet = null;
        this.editor         = {
            title    : "",
            content  : "",
            tags     : [],
            workbook : null,
        };
        

        // register callback for all kinds of action
        // this.snippet.registerFetchedAllCallback(this.fetchedAllCallback.bind(this));

        this.registerCallbacks({
            ACCOUNT_FETCH     : this.fetchedLoginedAccountCallback,

            SNIPPET_SHOW      : this.showCallback,
            SNIPPET_STORE     : this.storedCallback,
            SNIPPET_UPDATE    : this.updatedCallback,

        });

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
            this.snippet.show(snippet);
        }else{
            console.error("unknown snippet");
        }
    }

    
    showCallback (parameters) {
        this.currentSnippet = parameters.response;
        this.currentSnippet.htmlContent = Markdown(this.currentSnippet.content);

        this.editor.title   = this.currentSnippet.title;
        this.editor.content = this.currentSnippet.content;

        var workbookId = this.stateParams.workbook;
        this.editor.workbook = this.workbook.getById(workbookId);

        
    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

    edit() {
        this.editor.show = true;
    }

    fork() {
        this.editor.show = true;
    }

    comment() {

    }

    editorSavedCallback() {

        var formData = {
            title: this.editor.title,
            content: this.editor.content,
            tags: this.editor.tags,
            workbookId: this.editor.workbook === null ? 0 : this.editor.workbook.id,
        };

        console.log(formData);

        if(this.stateParams.snippet) {
            this.snippet.update(this.stateParams.snippet, formData);
        }else{
            this.snippet.store(formData);
        }
        
    }

    storedCallback(parameters) {
        console.log("stored");
        console.log(parameters);
    }

    updatedCallback(parameters) {
        console.log("udpated");
        console.log(parameters);
    }



    editorCancelCallback() {
        this.state.go("workbookShow",{
            workbook: this.stateParams.workbook
        });
    }

    editorQuitCallback() {
        this.state.go("workbookShow",{
            workbook: this.stateParams.workbook
        });
    }

}

export default SnippetController;
