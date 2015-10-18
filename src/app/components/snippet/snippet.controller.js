
import FluxController from "../flux/flux.controller";

class SnippetController extends FluxController {
    
    constructor($scope, $state,$stateParams,Dispatcher, WorkbookService, AccountService, SnippetService, Markdown, toastr) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.TYPE_FORK    = "TYPE_FORK";
        this.TYPE_UPDATE  = "TYPE_UPDATE";
        
        this.toast          = toastr;        
        this.state          = $state;
        this.stateParams    = $stateParams;
        this.workbook       = WorkbookService;
        this.account        = AccountService;
        this.snippet        = SnippetService;
        this.markdown       = Markdown;

        this.editor         = {
            show     : false,
            title    : "",
            content  : "",
            tags     : [],
            workbook : null,
            snippetId    : null,
            refSnippetId : null,
        };

        this.currentSnippet = {
            title: "",
            content: "",
        };

        this.deleteDialog = { 
            show: false,
            outsideClickedCallback: this.deleteDialogOutsideClickedCallback.bind(this),
        };
        
        this.registerCallbacks({
            SNIPPET_SHOW      : this.showCallback,

            // snippet
            SNIPPET_UPDATE    : this.updatedCallback,
            SNIPPET_FORK      : this.forkedCallback,
        });

        // perform first action
        this.initialize();

    }

    initialize() {
        this.notfound = false;


        var snippet = this.stateParams.snippet;
        if(snippet.match(/^\d+$/g)) {
            this.snippet.show(snippet);
        }else{
            this.notfound = true;
        }
    }

    
    showCallback (res) {
        if(!res.success) {
            this.notfound = true;
            return;
        }

        var snippet = this.snippet.getFocusSnippet();
        this.editor.title   = snippet.title;
        this.editor.content = snippet.content;
        this.editor.workbook = snippet.workbooks.length > 0 ? snippet.workbooks[0] :null;
        this.currentSnippet = snippet;
    }



    // delete dialog event
    deleteDialogOutsideClickedCallback () {
        this.deleteDialog.show = false;
    }

    deleteDialogClose(){
        this.deleteDialog.show = false;
    }

    deleteDialogDeleteEvent(){
        this.snippet.destroy(this.currentSnippet.id);


        if(this.currentSnippet.workbooks.length > 0) {
            this.state.go("workbookShow", {workbook: this.currentSnippet.workbooks[0].id});
            return;
        }

        this.state.go("news");
    }

    /**
     *  comments box
     *
     */
    commentsBoxOutsideClickedCallback() {
        this.commentBox.show = false;
    }

    /**
     *  crud snippet
     *
     */
    editSnippet() {

        var snippet = this.currentSnippet;

        this.editor.type      = this.TYPE_UPDATE;
        this.editor.show      = true;
        this.editor.title     = snippet.title;
        this.editor.content   = snippet.content;
        this.editor.tags      = snippet.tags;
        this.editor.snippetId = snippet.id;
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
        this.savingFlag = false;
    }

    editorSavedCallback() {
        if(this.savingFlag) {
            return;
        }

        if(this.editor.type === this.TYPE_FORK) {
            this.savingFlag = true;

            var params = {
                title:        this.editor.title,
                content:      this.editor.content,
                tags:         this.editor.tags,
                workbookId:   this.editor.workbook === null ? 0 :this.editor.workbook.id,
                refSnippetId: this.editor.refSnippetId,
            };

            this.snippet.fork(params);
        }else if(this.editor.type === this.TYPE_UPDATE) {
            this.savingFlag = true;

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

    deleteSnippet(){
        this.deleteDialog.show = true;
    }

    /*
     * Fork
     */
    forkSnippet() {
        var snippet = this.currentSnippet;

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
        this.savingFlag = false;
    }    

}

export default SnippetController;
