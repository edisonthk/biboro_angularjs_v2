import ShortcutTask from "../shortcut/shortcut.task";

class FluxController {
    constructor($scope, Dispatcher) {
        'ngInject';

        this._scope = $scope;
        this._dispatcher = Dispatcher;

        this._scope.$on("$destroy", this.onDestruct.bind(this));

        this.dispatchToken = [];

        if (navigator.userAgent.match('Mac OS X')) {
            this._scope.CMD_KEY = "⌘";
        } else {
            this._scope.CMD_KEY = "Ctrl";
        }
        
        this.onkeyupEvent = this.onkeyup.bind(this);
        window.addEventListener("keyup", this.onkeyupEvent, true);

        this.onkeydownEvent = this.onkeydown.bind(this);
        window.addEventListener("keydown", this.onkeydownEvent, true);
    }
    
    onkeyup(e) {
        // onkeyup action
    }

    onkeydown(e) {}

    registerCallbacks(callbacks) {
        for(var storeType in callbacks) {
            
            this._scope[storeType] = {
                _callback: callbacks[storeType]
            };
            
            var dispatchToken = this._dispatcher.register(storeType, this._scope[storeType]._callback.bind(this));
            this.dispatchToken.push(dispatchToken);
        }
    }

    onDestruct() {

        ShortcutTask.clearTask(this._shortcutTaskToken);
        ShortcutTask.clearParallelTask(this._shortcutParallelTaskToken);

        window.removeEventListener("keyup",this.onkeyupEvent);
        window.removeEventListener("keydown",this.onkeydownEvent);

        this._dispatcher.detach(this.dispatchToken);
    }

    generateHash()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    extractDomain(url) {
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
}

export default FluxController;