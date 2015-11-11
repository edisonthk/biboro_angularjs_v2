class EditorFactory {
    constructor () {
        'ngInject';

        this.test = "helo";
    }

    setController(ctrl) {
        this.ctrl = ctrl;
    }

    getController(ctrl) {
        return this.ctrl;
    }

    isShow() {
        var ctrl = this.getController();
        return ctrl._scope.show;
    }

    show(options) {
        var ctrl = this.getController();
        ctrl.headline = options.headline;
        ctrl.title = options.title;
        ctrl.content = options.content;
        ctrl.workbooks = options.workbooks;
        ctrl.snippetId = options.snippetId;
        ctrl.selectedWorkbook = options.selectedWorkbook;
        ctrl.refSnippetId = options.refSnippetId;
        ctrl.type = options.type;

        this.quitCallback = options.quitCallback;
        this.cancelCallback = options.cancelCallback;
        this.savedCallback = options.savedCallback;

        ctrl._scope.show = true;
    }

    hide() {
        var ctrl = this.getController();
        ctrl._scope.show = false;
    }
}

export default EditorFactory;
