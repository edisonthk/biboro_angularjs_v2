
class CommentService {

    constructor($http,Dispatcher, Api) {
        this._dispatcher = Dispatcher;
        this._http       = $http;

        this.COMMENT_FETCH_CALLBACK   = "COMMENT_FETCH_CALLBACK";
        this.COMMENT_UPDATE_CALLBACK  = "COMMENT_UPDATE_CALLBACK";
        this.COMMENT_DESTROY_CALLBACK = "COMMENT_DESTROY_CALLBACK";
        this.COMMENT_STORE_CALLBACK   = "COMMENT_STORE_CALLBACK";

        this.commentSnippets = [];

        this.api = Api;
    }

    
    registerFetchCallback(cb) {
        this._dispatcher.register(this.COMMENT_FETCH_CALLBACK,cb);
    }

    registerUpdateCallback(cb) {
        this._dispatcher.register(this.COMMENT_UPDATE_CALLBACK,cb);
    }

    registerStoreCallback(cb) {
        this._dispatcher.register(this.COMMENT_STORE_CALLBACK,cb);
    }

    registerDestroyCallback(cb) {
        this._dispatcher.register(this.COMMENT_DESTROY_CALLBACK,cb);
    }

    fetchComments(snippetId) {

        var self = this;

        var req = {
            method : self.api.comment.show.method,
            url    : self.api.comment.show.url.replace(":snippetId",snippetId),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.setComments(snippetId, response);
                self._dispatcher.dispatch(self.COMMENT_FETCH_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.COMMENT_FETCH_CALLBACK, {"success":false,"result":"fail to fetch comments from following snippet :"+snippetId});
            });
    }

    store(snippetId, params) {
        var self= this;

        var req = {
            method : self.api.comment.store.method,
            url    : self.api.comment.store.url.replace(":snippetId",snippetId),
            data   : params,
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.appendComment(snippetId, response);
                self._dispatcher.dispatch(self.COMMENT_STORE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.COMMENT_STORE_CALLBACK, {"success":false,"result":"fail to fetch comments from following snippet :"+snippetId+" with commentId :"+commentId});
            });
    }

    update(snippetId, commentId, params){
        var self= this;

        var req = {
            method : self.api.comment.update.method,
            url    : self.api.comment.update.url.replace(":snippetId",snippetId).replace(":commentId",commentId),
            data   : params,
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.updateComment(snippetId, commentId, response);
                self._dispatcher.dispatch(self.COMMENT_UPDATE_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.COMMENT_UPDATE_CALLBACK, {"success":false,"result":"fail to fetch comments from following snippet :"+snippetId+" with commentId :"+commentId});
            });
    }

    destroy(snippetId, commentId){
        var self= this;

        var req = {
            method : self.api.comment.destroy.method,
            url    : self.api.comment.destroy.url.replace(":snippetId",snippetId).replace(":commentId",commentId),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                // for (var i = 0; i < self.length; i++) {
                //     self.[i]
                // };
                self.destroyComment(snippetId, commentId);


                self._dispatcher.dispatch(self.COMMENT_DESTROY_CALLBACK, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.COMMENT_DESTROY_CALLBACK, {"success":false,"result":"fail to destroy snippets."});
            });
    }


    setComments(snippetId, comments) {
        for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {
                this.commentSnippets[i] = comments;
                return;
            }
        }

        this.commentSnippets.push({id: snippetId, comments: comments });
    }

    appendComment(snippetId, comment) {
        var group = this.getCommentGroup(snippetId);
        if(group.id == 0) {
            this.setComments(snippetId, [comment]);
        }else{
            group.comments.push(comment);
        }
    }

    getComment(snippetId, commentId) {
        for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {

                for (var j = 0; j < this.commentSnippets[i].comments.length; j++) {
                    if(this.commentSnippets[i].comments[j].id === commentId) {
                        return this.commentSnippets[i].comments[j];    
                    }
                }
                
            }
        }

        return null;
    }

    destroyComment(snippetId, commentId) {
        for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {
                for (var j = 0; j < this.commentSnippets[i].comments.length; j++) {
                    if(this.commentSnippets[i].comments[j].id === commentId) {
                        this.commentSnippets[i].comments.splice(j,1);    
                        return;
                    }
                }
                
            }
        }
    }

    updateComment(snippetId, commentId, comment) {
        var c = this.getComment(snippetId, commentId);
        if(c) {
            for(var key in comment) {
                c[key] = comment[key];
            }
        }
    }

    getCommentGroup(snippetId) {
        for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {
                return this.commentSnippets[i];
            }
        }
        // dummy data
        return {id:0, comments:[]};
    }

    getCommentsBySnippetId(snippetId) {
        return this.getCommentGroup(snippetId).comments;
    }

}

export default CommentService;
