import KeyCode from "../shortcut/shortcut.config";
import FluxController from "../flux/flux.controller";
import Helper from "../helper/helper";


class NavbarController extends FluxController {
    constructor ($scope,Dispatcher, AccountService, RouteService,WorkbookService, SnippetService, $interval, $stateParams, $state, toastr, FeedbackService, NotificationService, EditorFactory, ChromeExtension) {
        'ngInject';
        
        super($scope, Dispatcher);

        this.toast       = toastr;
        this.route       = RouteService;  
        this.feedback    = FeedbackService;
        this.account     = AccountService;
        this.workbook    = WorkbookService;
        this.snippet     = SnippetService;
        this.stateParams = $stateParams;
        this.state       = $state;
        this.notification   = NotificationService;
        this.editor = EditorFactory;
        this.extension   = ChromeExtension;

        this.command = {};
        this.showWorkbookListFlag = false;

        this.dndDialog = {
            show : false,
            list : [],
            selected : null,
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
            if(this.editor.isShow()) {
                return;
            }
            console.log("newSnippet")
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

        this.editor.show({
            headline: "新しいスニペットを作成",
            title: "",
            content: "",
            workbooks: this.workbook.getAll(),
            selectedWorkbook: this.workbook.getCurrentWorkbook(),
            quitCallback: this.editorQuitCallback.bind(this),
            cancelCallback: this.editorCancelCallback.bind(this),
            savedCallback: this.editorSavedCallback.bind(this)
        });
    }

    editorSavedCallback(editor) {

        if(this.savingFlag) {
            return;
        }
        this.savingFlag = true;
        
        this.snippet.store({
            title:      editor.title,
            content:    editor.content,
            workbookId: editor.selectedWorkbook === null ? 0 : editor.selectedWorkbook.id ,
        });
    }

    storedCallback(res) {
        this.savingFlag = false;
        if(res.success) {
            
            this.editor.hide();

            this.toast.success("作成完了！");    
            this.state.go("snippet",{snippet: this.snippet.getFocusSnippet().id});
        } else {
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