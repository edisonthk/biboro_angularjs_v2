import KeyCode from "../shortcut/shortcut.config";
import ShortcutTask from "../shortcut/shortcut.task";
import FluxController from "../flux/flux.controller";

class WorkbookShowController extends FluxController {
    constructor($scope ,$state ,$stateParams ,Dispatcher,WorkbookService, AccountService, RouteService, SnippetService, Markdown, toastr) {
        super.constructor($scope, Dispatcher);

        this.toast        = toastr;
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

        // register action
        this.registerCallbacks({
            // workbook
            WORKBOOK_SHOW    : this.showCallback,
            WORKBOOK_STORE   : this.workbookStoreCallback,
            WORKBOOK_UPDATE  : this.updateCallback,

            // account
            ACCOUNT_FETCH    : this.fetchedLoginedAccountCallback,

            // route
            ROUTE_UPDATED    : this.stateUpdatedCallback,
        });

        // dialog
        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);
        this.commentBox.outsideClickedCallback  = this.commentsBoxOutsideClickedCallback.bind(this);

        this.initialize();

    }

    initialize() {
        this.account.fetchLoginedAccount();

        this.currentWorkbook = null;

        var workbook = this.stateParams.workbook;
        if(workbook) {
            this.workbook.show(workbook);
        }
    }

    showCallback() {

        this.currentWorkbook = this.workbook.getCurrentWorkbook();
        this.editDialog.title = this.currentWorkbook.title;

        // for debug purpose
        // this.commentBox.snippet = this.currentWorkbook.snippets[0];

        for (var i = 0; i < this.currentWorkbook.snippets.length; i++) {
            var snippet = this.currentWorkbook.snippets[i];
            snippet.htmlContent = this.markdown.parseMd(snippet.content);
        }

    }

    fetchedLoginedAccountCallback() {
        // console.log(parameters);
    }

    stateUpdatedCallback() {
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

    updateCallback() {
        
        // var workbook = parameters.response;
        
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
