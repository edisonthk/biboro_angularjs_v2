
var ShortcutTask = {
    generateToken: function() {
        return Math.random() + "b" + Math.random();
    },
    setTask: function(cb) {
        
        this.cbToken = this.generateToken();
        this.cb = cb;
        return this.cbToken;
    },
    clearTask: function(cbToken) {
        if(cbToken === this.cbToken) {
            delete this.cb;    
        }
    },
    clearParallelTask: function(cbToken) {
        if(cbToken === this.parallelCbToken) {
            delete this.parallelCb;    
        }
    },
    setParallelTask: function(cb) {
        this.parallelCbToken = this.generateToken();
        this.parallelCb = cb;
        return this.parallelCbToken;
    },
    haveParallelTask: function() {
        return typeof this.parallelCb !== "undefined";
    },
    haveTask: function() {
        
        return typeof this.cb !== "undefined";
    },
};

export default ShortcutTask;