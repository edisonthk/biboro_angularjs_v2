import Helper from "../helper/helper";
import FluxController from "../flux/flux.controller";

class NewsController extends FluxController {    

    constructor($scope ,$state ,$stateParams ,Dispatcher,AccountService,WorkbookService, SnippetService, NewsService,Markdown, toastr) {
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

        this.editor       = {
            type     : "fork",
            show     : false,
            title    : "",
            content  : "",
            tags     : [],
            refSnippetId: null,
            workbook : null,
        };
        
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

        this.editorSavedCallback = this.editorSavedCallback.bind(this);

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
    editorSavedCallback() {

        var params = {
            title:        this.editor.title,
            content:      this.editor.content,
            tags:         this.editor.tags,
            workbookId:   this.editor.workbook === null ? 0 : this.editor.workbook.id,
            refSnippetId: this.editor.refSnippetId,
        }
        
        this.snippet.fork(params);
    }

    forkSnippet(news) {
        this.editor.title        = news.title;
        this.editor.content      = news.content;
        this.editor.tags         = news.tags;
        this.editor.refSnippetId = news.id
        this.editor.show         = true;
    }

    newsForkCallback(res) {
        if(res.success) {
            this.toast.success("フォークしました！");
            this.editor.show = false;
        }else {
            var error = res.error.error;
            this.toast.error(Helper.parseErrorMessagesAsHtml(error));
        }
    }

    editorQuitCallback() {
        this.editor.show = false;
    }

    editorCancelCallback() {
        this.editor.show = false;
    }
}

export default NewsController;
