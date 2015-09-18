import KeyCode from "../shortcut/shortcut.config";
import FluxController from "../flux/flux.controller";
import ShortcutTask from "../shortcut/shortcut.task";

class NavbarController extends FluxController {
    constructor ($scope,Dispatcher, AccountService, RouteService,WorkbookService, SnippetService, $stateParams, $state, toastr) {
        super.constructor($scope, Dispatcher);

        this.toast       = toastr;
        this.route       = RouteService;  
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
        });

        this.account.fetchLoginedAccount();

        this.selectedPaneCallback = function(pane) {
            $state.go("workbookShow",{workbook:  pane.id});
        }

        this._shortcutParallelTaskToken = ShortcutTask.setParallelTask(this.keyupTask.bind(this));
    }

    loadTags(query) {
        console.log(query);
        return [];
    }

    keyupTask(e) {
        
        var ctrlKey = (e.ctrlKey || e.metaKey);
        console.log(e.keyCode + " " + KeyCode.KEY_B);   
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
            this.updateSelectedPane();
            this.workbook.fetchAll();
            this.showWorkbookListFlag = true;

        }
    }

    fetchAllCallback(parameters) {
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

    storedCallback(parameters) {
        this.editor.show = false;
        this.toast.success("作成完了！");
    }

    editorQuitCallback() {
        this.editor.show = false;
    }

    editorCancelCallback() {
        this.editor.show = false;
    }
}

export default NavbarController;