import Helper from "../helper/helper";
import FluxController from "../flux/flux.controller";

class WorkbookShowController extends FluxController {
    constructor($scope ,$state ,$stateParams ,Dispatcher,WorkbookService, AccountService, RouteService, SnippetService, Markdown, toastr) {
        super.constructor($scope, Dispatcher);

        this.TYPE_FORK    = "TYPE_FORK";
        this.TYPE_UPDATE  = "TYPE_UPDATE";

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
            snippetId    : null,
            refSnippetId : null,
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
        this.deleteDialog = {
            show: false,
            snippet: null
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

            // snippet
            SNIPPET_UPDATE    : this.updatedCallback,
            SNIPPET_FORK      : this.forkedCallback,
        });

        // dialog
        this.createDialog.outsideClickedCallback = this.createDialogOutsideClickedCallback.bind(this);
        this.editDialog.outsideClickedCallback   = this.editDialogOutsideClickedCallback.bind(this);
        this.commentBox.outsideClickedCallback  = this.commentsBoxOutsideClickedCallback.bind(this);
        this.deleteDialog.outsideClickedCallback   = this.deleteDialogOutsideClickedCallback.bind(this);

        this.initialize();

    }

    initialize() {
        this.account.fetchLoginedAccount();

        this.workbook.fetchAll();
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


    // delete dialog event
    deleteDialogOutsideClickedCallback () {
        this.deleteDialog.show = false;
    }

    deleteDialogClose(){
        this.deleteDialog.show = false;
    }

    deleteDialogDeleteEvent(snippet){
        this.snippet.destroy(snippet.id);
        this.state.go(this.state.current, {}, {reload: true});
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

        this.editor.type      = this.TYPE_UPDATE;
        this.editor.show      = true;
        this.editor.title     = snippet.title;
        this.editor.content   = snippet.content;
        this.editor.tags      = snippet.tags;
        this.editor.snippetId = snippet.id;
        this.editor.workbook  = this.currentWorkbook;
        this.editor.refSnippetId = null;
    }

    updatedCallback(res) {
        if(res.success) {
            this.toast.success("編集しました");
            this.editor.show = false;
        }else {
            var error = res.error.error;
            this.toast.error(Helper.parseErrorMessagesAsHtml(error));
        }
    }

    editorSavedCallback() {

        if(this.editor.type === this.TYPE_FORK) {
            var params = {
                title:        this.editor.title,
                content:      this.editor.content,
                tags:         this.editor.tags,
                workbookId:   this.editor.workbook === null ? 0 :this.editor.workbook.id,
                refSnippetId: this.editor.refSnippetId,
            };

            this.snippet.fork(params);
        }else if(this.editor.type === this.TYPE_UPDATE) {
            var formData = {
                title: this.editor.title,
                content: this.editor.content,
                tags: this.editor.tags,
                workbookId: this.editor.workbook === null ? 0 :this.editor.workbook.id,
            };


            this.snippet.update(this.editor.snippetId, formData);
        }else {
            console.error("unknown editor type");
        }
        
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
        this.deleteDialog.show = true;
        this.deleteDialog.snippet = snippet;
    }

    /*
     * Fork
     */
    forkSnippet(snippet) {
        this.editor.type         = this.TYPE_FORK;
        this.editor.title        = snippet.title;
        this.editor.content      = snippet.content;
        this.editor.tags         = snippet.tags;
        this.editor.snippetId    = null;
        this.editor.refSnippetId = snippet.id;
        this.editor.show         = true;
    }

    forkedCallback(res) {
        if(res.success) {
            this.toast.success("フォークしました！");
            this.editor.show = false;
        }else {
            var error = res.error.error;
            this.toast.error(Helper.parseErrorMessagesAsHtml(error));
        }
    }    

}

export default WorkbookShowController;
