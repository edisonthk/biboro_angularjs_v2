
class CommentService {

    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        this._dispatcher = Dispatcher;
        this._http       = $http;

        this.COMMENT_FETCH   = "COMMENT_FETCH";
        this.COMMENT_UPDATE  = "COMMENT_UPDATE";
        this.COMMENT_DESTROY = "COMMENT_DESTROY";
        this.COMMENT_STORE   = "COMMENT_STORE";

        this.commentSnippets = [];

        this.api = Api;
    }

    
    fetchComments(snippetId) {

        var self = this;

        if(self.haveComment(snippetId)) {

            self._dispatcher.dispatch(self.COMMENT_FETCH, {"success":true,"result":"success"});
            return;
        }

        var req = {
            method : self.api.comment.show.method,
            url    : self.api.comment.show.url.replace(":snippetId",snippetId),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                self.setComments(snippetId, response);
                self._dispatcher.dispatch(self.COMMENT_FETCH, {"success":true,"result":"success"});
            })
            .error(function(){
                console.log("error in snippet.strore.js");
                self._dispatcher.dispatch(self.COMMENT_FETCH, {"success":false,"result":"fail to fetch comments from following snippet :"+snippetId});
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
                self._dispatcher.dispatch(self.COMMENT_STORE, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.COMMENT_STORE, {"success":false,"result":"fail to fetch comments from following snippet :"+snippetId});
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
                self._dispatcher.dispatch(self.COMMENT_UPDATE, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.COMMENT_UPDATE, {"success":false,"result":"fail to fetch comments from following snippet :"+snippetId+" with commentId :"+commentId});
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


                self._dispatcher.dispatch(self.COMMENT_DESTROY, {"success":true,"result":"success","response":response});
            })
            .error(function(){
                self._dispatcher.dispatch(self.COMMENT_DESTROY, {"success":false,"result":"fail to destroy snippets."});
            });
    }

    haveComment(snippetId) {
        for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {
                return true;
            }
        }
        return false;
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
        if(group.id === 0) {
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
