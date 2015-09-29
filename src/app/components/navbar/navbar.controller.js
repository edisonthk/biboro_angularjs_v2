import KeyCode from "../shortcut/shortcut.config";
import ShortcutTask from "../shortcut/shortcut.task";
import FluxController from "../flux/flux.controller";
import Helper from "../helper/helper";


class NavbarController extends FluxController {
    constructor ($scope,Dispatcher, AccountService, RouteService,WorkbookService, SnippetService, $stateParams, $state, toastr, FeedbackService) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.toast       = toastr;
        this.route       = RouteService;  
        this.feedback    = FeedbackService;
        this.account     = AccountService;
        this.workbook    = WorkbookService;
        this.snippet     = SnippetService;
        this.stateParams = $stateParams;
        this.state       = $state;

        this.command = {};
        this.workbooks = [];
        this.showWorkbookListFlag = false;
        this.editor         = {
            show     : false,
            title    : "",
            content  : "",
            tags     : [],
            workbook : null,
        };

        this.feedbackContent = "";
        this.feedbackShow = false;
        
        this.tags = [
                { value: 'foo', text: 'Foo' },
                { value: 'bar', text: 'Bar' },
                { value: 'beep', text: 'Beep' },
            ];
        
        // "this.creation" is avaible by directive option "bindToController: true"
        // this.relativeDate = moment(this.creationDate).fromNow();

        
        this.registerCallbacks({
            WORKBOOK_FETCHALL : this.fetchAllCallback,
            ACCOUNT_FETCH     : this.fetchLoginAccount,
            ROUTE_UPDATED     : this.stateUpdatedCallback,

            SNIPPET_STORE     : this.storedCallback,

            FEEDBACK_SENT     : this.feedbackSentCallback,
        });

        this.account.fetchLoginedAccount();

        this.selectedPaneCallback = function(pane) {
            $state.go("workbookShow",{workbook:  pane.id});
        }

        this.closeDialog = this.closeDialog.bind(this);
        this._shortcutParallelTaskToken = ShortcutTask.setParallelTask(this.keyupTask.bind(this));
    }

    loadTags(query) {
        console.log(query);
        return [];
    }

    keyupTask(e) {
        
        var ctrlKey = (e.ctrlKey || e.metaKey);
        if(ctrlKey && e.keyCode === KeyCode.KEY_B) {
            this.newSnippet();

        }

        this._scope.$apply();
    }

    stateUpdatedCallback(parameters) {

        if(parameters.toState.name === 'workbook') {
            this.workbooks = [];
            this.showWorkbookListFlag = false;
        }else {
            // this.updateSelectedPane();
            this.workbook.fetchAll();
            this.showWorkbookListFlag = true;

        }
    }

    fetchAllCallback(parameters) {
        console.log("a");
        this.workbooks = parameters.response;
        if(!this.workbooks) {
            return;
        }

        var workbookId = this.route.getCurrentParams().workbook;
        if(workbookId) {
            for (var i = 0; i < this.workbooks.length; i++) {
                if(this.workbooks[i].id === parseInt(workbookId)) {
                    this.editor.workbook = this.workbooks[i];
                    break;
                }
            };
        }

        this.updateSelectedPane();
    }

    updateSelectedPane() {
        var workbook = this.stateParams.workbook;
        if(workbook) {
            this.selectedWorkbook = this.workbook.getById(workbook) || {};
        }
    }

    fetchLoginAccount(parameters) {
        if(parameters.result) {
            this.accountInfo = parameters.data;
        }else{
            this.accountInfo = null;
        }
    }

    /**
     *  crud snippet
     *
     */
    newSnippet() {
        this.editor.workbook = this.workbook.workbook;
        this.editor.show = true;
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

    storedCallback(res) {
        if(res.success) {
            this.editor.show = false;
            this.editor.title = "";
            this.editor.content = "";
            this.editor.tags = [];
            this.toast.success("作成完了！");    
        } else {
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

    closeDialog() {
        this.feedbackShow = false;
        this.notificationBoardShow = false;
    }

    /* Feedback */
    // ===============
    sendFeedback() {
        if(this.feedbackContent.length > 0) {
            this.feedback.send(this.feedbackContent);
        }else {
            this.toast.error("フィードバックの項目に空白しないでください");
        }
    }

    feedbackSentCallback(res) {
        this.toast.success("フィードバックいただき、ありがとうございます");
        this.feedbackShow = false;
    }

}

export default NavbarController;