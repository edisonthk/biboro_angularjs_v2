import Helper from "../helper/helper";
import KeyCode from "../shortcut/shortcut.config";
import FluxController from "../flux/flux.controller";

class SnippetController extends FluxController {
    
    constructor($scope, $state,$stateParams,Dispatcher, WorkbookService, AccountService, SnippetService, Markdown, toastr, EditorFactory) {
        'ngInject';
        
        super($scope, Dispatcher);

        this.TYPE_FORK    = "fork";
        this.TYPE_UPDATE  = "edit";
        
        this.toast          = toastr;        
        this.state          = $state;
        this.stateParams    = $stateParams;
        this.workbook       = WorkbookService;
        this.account        = AccountService;
        this.snippet        = SnippetService;
        this.markdown       = Markdown;

        this.editor = EditorFactory;
        // this.editor         = {
        //     type     : 'edit',
        //     show     : false,
        //     title    : "",
        //     content  : "",
        //     tags     : [],
        //     workbook : null,
        //     snippetId    : null,
        //     refSnippetId : null,
        // };

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
        this.editorSavedCallback = this.editorSavedCallback.bind(this);

        var snippet = this.stateParams.snippet;
        if(snippet.match(/^\d+$/g)) {
            this.snippet.show(snippet);
        }else{
            this.notfound = true;
        }

        // scroll to below navbar
        window.scrollTo(0,document.querySelector("navbar").clientHeight);
    }

    onkeydown(e) {
        var ctrlKey = (e.ctrlKey || e.metaKey);
        if(ctrlKey && e.keyCode === KeyCode.KEY_E) {
            this.editSnippet();
            e.preventDefault();
            this._scope.$apply();
        }else if(ctrlKey && e.keyCode === KeyCode.KEY_DEL) {
            this.deleteDialog.show = true;   
            e.preventDefault();
            this._scope.$apply();
        }else if(e.keyCode === KeyCode.KEY_ESC) {
            this.deleteDialog.show = false;
            e.preventDefault();
            this._scope.$apply();
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
        if(snippet.editable) {
            this.editor.type="edit";
        }else {
            this.editor.type="fork";
        }

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

        this.editor.show({
            type: this.TYPE_UPDATE,
            headline: "新しいスニペットを作成",
            title: snippet.title,
            content: snippet.content,

            snippetId: snippet.id,
            refSnippetId: null,


            workbooks: this.workbook.getAll(),
            selectedWorkbook: snippet.workbooks[0],
            quitCallback: this.editorQuitCallback.bind(this),
            cancelCallback: this.editorCancelCallback.bind(this),
            savedCallback: this.editorSavedCallback.bind(this)
        });
    }

    updatedCallback(res) {
        if(res.success) {
            this.toast.success("編集しました");
            this.editor.hide();
        }else {
            var error = res.error.error;
            this.toast.error(Helper.parseErrorMessagesAsHtml(error));
        }
        this.savingFlag = false;
    }

    editorSavedCallback(editor) {
        
        if(this.savingFlag) {
            return;
        }
        
        if(editor.type === this.TYPE_FORK) {
            this.savingFlag = true;

            var params = {
                title:        editor.title,
                content:      editor.content,
                workbookId:   editor.selectedWorkbook === null ? 0 : editor.selectedWorkbook.id,
                refSnippetId: editor.refSnippetId,
            };

            this.snippet.fork(params);
        }else if(editor.type === this.TYPE_UPDATE) {
            this.savingFlag = true;

            var formData = {
                title:      editor.title,
                content:    editor.content,
                workbookId: editor.selectedWorkbook === null ? 0 : editor.selectedWorkbook.id,
            };


            this.snippet.update(editor.snippetId, formData);
        }else {
            console.error("unknown editor type");
        }
        
    }

    editorQuitCallback() {
        // this.editor.show = false;

        this.editor.hide();
    }

    editorCancelCallback() {
        // this.editor.show = false;
        this.editor.hide();
    }

    deleteSnippet(){
        this.deleteDialog.show = true;
    }

    /*
     * Fork
     */
    forkSnippet() {
        var snippet = this.currentSnippet;

        this.editor.show({
            type: this.TYPE_FORK,
            headline: "フォーク",
            title: snippet.title,
            content: snippet.content,

            snippetId: null,
            refSnippetId: snippet.id,


            workbooks: this.workbook.getAll(),
            selectedWorkbook: snippet.workbooks[0],
            quitCallback: this.editorQuitCallback.bind(this),
            cancelCallback: this.editorCancelCallback.bind(this),
            savedCallback: this.editorSavedCallback.bind(this)
        });
    }

    forkedCallback(res) {
        if(res.success) {
            this.toast.success("フォークしました！");
            this.editor.hide();
        }else {
            var error = res.error.error;
            this.toast.error(Helper.parseErrorMessagesAsHtml(error));
        }
        this.savingFlag = false;
    }    

}

export default SnippetController;
