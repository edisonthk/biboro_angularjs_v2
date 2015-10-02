import Helper from "../helper/helper";
import FluxController from "../flux/flux.controller";

class NewsController extends FluxController {
    constructor($scope ,$state ,$stateParams ,Dispatcher,WorkbookService, SnippetService, NewsService,Markdown, toastr) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.toast        = toastr;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.workbook     = WorkbookService;
        this.snippet      = SnippetService;
        this.news         = NewsService;
        this.markdown     = Markdown;

        this.editor       = {
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
            NEWS_FETCHALL:   this.fetchAllCallback,

            SNIPPET_FORK:    this.newsForkCallback,

        });

        // dialog
        this.commentBox.outsideClickedCallback  = this.commentsBoxOutsideClickedCallback.bind(this);

        this.initialize();

    }

    initialize() {
        this.news.fetchAll();
        this.workbook.fetchAll();
    }

    fetchAllCallback(parameters) {
        var self = this;
        console.log("d");
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

    showCallback(parameters) {

        this.currentWorkbook = this.workbook.getCurrentWorkbook();
        this.editDialog.title = this.currentWorkbook.title;

        // for debug purpose
        // this.commentBox.snippet = this.currentWorkbook.snippets[0];

        for (var i = 0; i < this.currentWorkbook.snippets.length; i++) {
            var snippet = this.currentWorkbook.snippets[i];
            snippet.htmlContent = this.markdown.parseMd(snippet.content);
        }

    }

    extractDomain( url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        //find & remove port number
        domain = domain.split(':')[0];

        return domain;
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
