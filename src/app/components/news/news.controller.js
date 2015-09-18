
import FluxController from "../flux/flux.controller";

class NewsController extends FluxController {
    constructor($scope ,$state ,$stateParams ,Dispatcher, SnippetService, NewsService,Markdown) {
        super.constructor($scope, Dispatcher);

        this._scope       = $scope;
        this.state        = $state;
        this.stateParams  = $stateParams;
        this.snippet      = SnippetService;
        this.news         = NewsService;
        this.markdown     = Markdown;

        
        this.commentBox = {
            show: false,
            snippet: null,
        };

        // register action
        this.registerCallbacks({
            NEWS_FETCHALL:   this.fetchAllCallback.bind(this),

        });

        // dialog
        this.commentBox.outsideClickedCallback  = this.commentsBoxOutsideClickedCallback.bind(this);

        this.initialize();

    }

    initialize() {
        this.news.fetchAll();
    }

    fetchAllCallback(parameters) {
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


}

export default NewsController;
