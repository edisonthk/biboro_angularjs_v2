
class ShortcutService {
    constructor(Dispatcher) {

        var self = this;
        self._dispatcher = Dispatcher;

        this.SHORTCUT_KEYUP = "SHORTCUT_KEYUP";

        window.onkeydown = function(e) {
            self._dispatcher.dispatch(self.SHORTCUT_KEYUP, e);
        }
    }

    registerKeyupCallback(cb) {
        this._dispatcher.register(this.SHORTCUT_KEYUP,cb);
    }
}

export default ShortcutService;
