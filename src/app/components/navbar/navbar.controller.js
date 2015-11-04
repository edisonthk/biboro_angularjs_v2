import KeyCode from "../shortcut/shortcut.config";
import FluxController from "../flux/flux.controller";
import Helper from "../helper/helper";


class NavbarController extends FluxController {
    constructor ($scope,Dispatcher, AccountService, RouteService,WorkbookService, SnippetService, $interval, $stateParams, $state, toastr, FeedbackService, NotificationService) {
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
        this.notification   = NotificationService;

        this.command = {};
        this.showWorkbookListFlag = false;

        this.dndDialog = {
            show : false,
            list : [],
            selected : null,
        };

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
            WORKBOOK_ORDER_UPDATE : this.workbookOrderUpdateCallback,
        });

        this.account.fetchLoginedAccount();

        this.selectedPaneCallback = function(pane) {
            $state.go("workbookShow",{workbook:  pane.id});
        }

        this.closeDialog = this.closeDialog.bind(this);
        this.closeNotificationDialog = this.closeNotificationDialog.bind(this);
        this.initializeFlag = true;
        this.savingFlag = false;

        this.notification.fetchAll();
        $interval(this.updateNotificationIntervally.bind(this), 10000);

    }

    updateNotificationIntervally() {
        this.notification.fetchAll();
    }

    moveToTarget(notice) {
        if(notice.comment) {
            this.state.go("snippet",{snippet:  notice.comment.snippet_id});
        }else if(notice.snippet) {
            this.state.go("snippet",{snippet:  notice.snippet.id});
        }
        this.closeNotificationDialog();
    }

    onkeydown(e) {
        
        var ctrlKey = (e.ctrlKey || e.metaKey);
        if(ctrlKey && e.keyCode === KeyCode.KEY_B) {
            this.newSnippet();
            this._scope.$apply();
            return;
        }
    }

    stateUpdatedCallback(parameters) {

        if(parameters.toState.name === 'workbook') {
            this.showWorkbookListFlag = false;
        }else {
            if(this.initializeFlag){
                this.initializeFlag = false;
                this.workbook.fetchAll();
            }else{
                this.updateSelectedPane();
            }
            
            this.showWorkbookListFlag = true;
        }
    }

    fetchAllCallback() {

        // if(workbookId) {
        //     for (var i = 0; i < this.workbooks.length; i++) {
        //         if(this.workbooks[i].id === workbookId) {
        //             this.editor.workbook = this.workbooks[i];
        //             break;
        //         }
        //     };
        // }
        this.dndDialog.list = this.workbook.getAll();

        this.updateSelectedPane();
    }

    dndDialogSubmit() {

        var orders = {};
        for (var i = 0; i < this.dndDialog.list.length; i++) {
            orders[this.dndDialog.list[i].id] = i + 1;
        }

        this.workbook.updateOrder(orders);
    }

    updateSelectedPane() {
        var workbook = this.route.getCurrentParams().workbook;
        if(workbook) {
            this.selectedWorkbook = this.workbook.getDataById(workbook) || {};
        }
    }

    fetchLoginAccount(res) {
        if(res.success) {
            this.accountInfo = this.account.getUser();
        }else{
            this.accountInfo = null;
        }
    }

    /**
     *  crud snippet
     *
     */
    newSnippet() {
        this.editor.workbook = this.workbook.getCurrentWorkbook();
        this.editor.show = true;
    }

    editorSavedCallback() {


        console.log(this.editor.title);
        console.log(this.editor.content);
        // if(this.savingFlag) {
        //     return;
        // }
        // this.savingFlag = true;
        
        // this.snippet.store({
        //     title: this.editor.title,
        //     content: this.editor.content,
        //     tags: this.editor.tags,
        //     workbookId: this.editor.workbook === null ? 0 : this.editor.workbook.id ,
        // });
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
        this.savingFlag = false;
    }

    editorQuitCallback() {
        this.editor.show = false;
    }

    editorCancelCallback() {
        this.editor.show = false;
    }

    showNotificationBoard() {
        this.notificationBoardShow = true;

        var noticeIds = [];
        var notices = this.notification.getAll();
        for (var i = 0; i < notices.length; i++) {
            if(!notices[i].read) {
                noticeIds.push(notices[i].id);
            }
        }

        if(noticeIds.length > 0) {
            this.notification.markAsRead(noticeIds);    
        }
    }

    closeNotificationDialog() {
        this.notificationBoardShow = false;

        var notices = this.notification.getAll();
        for (var i = 0; i < notices.length; i++) {
            notices[i].read = true;
        }
    }

    closeDialog() {
        this.feedbackShow = false;
        this.dndDialog.show = false;
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

    workbookOrderUpdateCallback() {
        this.dndDialog.show = false;
        this.toast.success("順番を変更しました");
    }

    feedbackSentCallback(res) {
        this.toast.success("フィードバックいただき、ありがとうございます");
        this.feedbackShow = false;
    }

}

export default NavbarController;