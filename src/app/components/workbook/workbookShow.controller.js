
import BaseController from "../../base/base.controller";

class WorkbookShowController extends BaseController {
    constructor($scope ,$state ,$stateParams ,WorkbookService, AccountService, RouteService, SnippetService, Markdown) {
        this._scope       = $scope;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.snippet      = SnippetService;
        this.route        = RouteService;
        this.workbook     = WorkbookService;
        this.account      = AccountService;
        this.markdown     = Markdown;
        this.editor         = {
            show     : false,
            title    : "",
            content  : "",
            tags     : [],
            workbook : null,
        };

        this.createDialog = {
            show: false
        };
        this.editDialog   = {
            show: false
        };
        this.commentBox = {
            show: false,
            snippet: null,
        };

        $scope.$on("test1", function(){
            console.log("this is workbookshow controler");
        });

        console.log(this);

        // register action
        this.workbook.registerShowCallback(this.showCallback.bind(this));
        this.workbook.registerShowMyCallback(this.showMyCallback.bind(this));
        this.workbook.registerStoreCallback(this.workbookStoreCallback.bind(this));
        this.workbook.registerUpdateCallback(this.updateCallback.bind(this));

        this.route.registerStateUpdatedCallback(this.stateUpdatedCallback.bind(this));
        this.account.registerFetchedLoginedAccountCallback(this.fetchedLoginedAccountCallback.bind(this));

        // dialog
        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);
        this.commentBox.outsideClickedCallback  = this.commentsBoxOutsideClickedCallback.bind(this);

        this.snippet.registerStoreCallback(this.storedCallback.bind(this));

        this.initialize();

    }

    initialize() {
        this.account.fetchLoginedAccount();

        this.currentWorkbook = null;

        var workbook = this.stateParams.workbook;
        if(workbook) {
            if(workbook.match(/^\d+$/g)) {
                // workbook is number
                this.workbook.show(workbook);    
            }else if(workbook === 'me'){
                // workbook is my workbook, show my workbook
                this.workbook.showMy();
            }else {
                // workbook not found
            }
        }

        this._scope.$watch(function() {

        });
    }

    showMyCallback(parameters) {
        // console.log(parameters);
        this.currentWorkbook = {
            id:       this.stateParams.workbook,
            title:    "マイ・ブック",
            snippets: parameters.response,
        };


        this.editDialog.title = this.currentWorkbook.title;
    }

    showCallback(parameters) {

        this.currentWorkbook = parameters.response.workbook;
        this.editDialog.title = this.currentWorkbook.title;

        // for debug purpose
        this.commentBox.snippet = this.currentWorkbook.snippets[0];

        for (var i = 0; i < this.currentWorkbook.snippets.length; i++) {
            var snippet = this.currentWorkbook.snippets[i];
            snippet.htmlContent = this.markdown.parseMd(snippet.content);
        }

    }

    fetchedLoginedAccountCallback(parameters) {
        // console.log(parameters);
    }

    stateUpdatedCallback(parameters) {
        // console.log(parameters);
        // this.currentWorkbook = null;
        // console.log(parameters);
    }

    showCreateDialog() {
        this.createDialog.show = true;
    }

    createDialogOutsideClickedCallback() {
        this.createDialog.show = false;
    }

    createDialogWorkbookEvent() {
        this.workbook.store({
            title: this.createDialog.title
        });
    }

    workbookStoreCallback(parameters) {
        if(parameters.result) {
            var workbook = parameters.response;
            this.state.go("workbook.show",{workbook: workbook.id});
        }
        this.createDialog.show = false;
    }

    // 
    showEditDialog() {
        this.editDialog.show = true;
    }

    // edit dialog event
    editDialogOutsideClickedCallback () {
        this.editDialog.show = false;
    }

    editDialogUpdateWorkbookEvent() {
        var formData = {
            title: this.editDialog.title
        };

        this.workbook.update(this.stateParams.workbook ,formData);
    }

    updateCallback(parameters) {
        if(parameters.success) {
            var workbook = parameters.response;
        }
    }

    /**
     *  comments box
     *
     */
    commentsBoxOutsideClickedCallback() {
        this.commentBox.show = false;
    }

    showCommentBox(snippet) {
        this.commentBox.show = true;
        this.commentBox.snippet = snippet;
    }


    /**
     *  crud snippet
     *
     */
    editSnippet(snippet) {
        this.state.go("workbookShow.snippet",{
            workbook: this.stateParams.workbook ,
            snippet: snippet.id
        });
    }

    editorSavedCallback() {
        // this.editor.show = false;
        this.snippet.store({
            title: this.editor.title,
            content: this.editor.content,
            tags: this.editor.tags,
            workbookId: this.editor.workbook === null ? 0 : this.editor.workbook.id ,
        });
    }

    storedCallback(parameters) {
        console.log(parameters);
    }

    editorQuitCallback() {
        this.editor.show = false;
    }

    editorCancelCallback() {
        this.editor.show = false;
    }

    deleteWorkbook() {
        this.workbook.destroy(this.workbook.workbook.workbook.id);
        this.state.go("workbook");
    }

    deleteSnippet(snippet){
        this.snippet.destroy(snippet.id);
        this.state.go(this.state.current, {}, {reload: true});
    }
}

export default WorkbookShowController;
