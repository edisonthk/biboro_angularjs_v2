import Helper from "../helper/helper";
import FluxController from "../flux/flux.controller";

class NewsController extends FluxController {    

    constructor($scope ,$state ,$stateParams ,Dispatcher,AccountService,WorkbookService, SnippetService, NewsService,Markdown, EditorFactory ,toastr) {
        'ngInject';

        super($scope, Dispatcher);

        this.toast        = toastr;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.workbook     = WorkbookService;
        this.snippet      = SnippetService;
        this.news         = NewsService;
        this.account      = AccountService;
        this.markdown     = Markdown;
        this.editor       = EditorFactory;

        // this.editor       = {
        //     type     : "fork",
        //     show     : false,
        //     title    : "",
        //     content  : "",
        //     tags     : [],
        //     refSnippetId: null,
        //     workbook : null,
        // };
        
        this.commentBox = {
            show: false,
            snippet: null,
        };

        // register action
        this.registerCallbacks({
            ACCOUNT_FETCH :   this.fetchLoginAccount,

            NEWS_FETCHALL :   this.fetchAllCallback,
            NEWS_SEARCHED :   this.fetchAllCallback,

            SNIPPET_FORK :    this.newsForkCallback,

        });

        // dialog
        this.commentBox.outsideClickedCallback  = this.commentsBoxOutsideClickedCallback.bind(this);

        this.initialize();

    }

    initialize() {

        this.news.fetchAll();
        this.workbook.fetchAll();
    }

    /**
     *
     */ 
    fetchLoginAccount(res) {
        if(!res.success) {
            this.account.signIn();
        }
    }

    /**
     *
     */ 
    fetchAllCallback() {
        var self = this;

        self.news.getAll().map(function(item) {
            if(item.workbooks.length > 0) {
                item.workbookId = item.workbooks[0].id;
            }else {
                item.workbookId = item.creator.url_path;
            }

            if(item.reference) {
                if(item.reference.method === 2) {
                    item.reference.domain = self.extractDomain(item.reference.target);
                }
                
            }

            item.htmlContent = self.markdown.parseMd(item.content);
            return item;
        });
    }

    showCallback(res) {

        this.currentWorkbook = this.workbook.getCurrentWorkbook();
        this.editDialog.title = this.currentWorkbook.title;

        // for debug purpose
        // this.commentBox.snippet = this.currentWorkbook.snippets[0];

        for (var i = 0; i < this.currentWorkbook.snippets.length; i++) {
            var snippet = this.currentWorkbook.snippets[i];
            snippet.htmlContent = this.markdown.parseMd(snippet.content);
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
     *  editor box
     *
     */
    editorSavedCallback(editor) {

        var params = {
            title:        editor.title,
            content:      editor.content,
            workbookId:   editor.selectedWorkbook === null ? 0 : editor.selectedWorkbook.id,
            refSnippetId: editor.refSnippetId,
        }
        
        this.snippet.fork(params);
    }

    forkSnippet(news) {

        var workbooks = this.workbook.getAll();

        this.editor.show({
            type: 'fork',
            headline: "フォーク",
            title: news.title,
            content: news.content,
            refSnippetId: news.id,


            workbooks: this.workbook.getAll(),
            selectedWorkbook: workbooks.length === 1 ? workbooks[0] : null,
            quitCallback: this.editorQuitCallback.bind(this),
            cancelCallback: this.editorCancelCallback.bind(this),
            savedCallback: this.editorSavedCallback.bind(this)
        });
    }

    newsForkCallback(res) {
        if(res.success) {
            this.toast.success("フォークしました！");
            this.editor.hide();
        }else {
            var error = res.error.error;
            this.toast.error(Helper.parseErrorMessagesAsHtml(error));
        }
    }

    editorQuitCallback() {
        this.editor.hide();
    }

    editorCancelCallback() {
        this.editor.hide();
    }
}

export default NewsController;
