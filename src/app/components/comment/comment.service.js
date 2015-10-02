import FluxService from "../flux/flux.service";

class CommentService extends FluxService {

    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        super.constructor($http, Dispatcher);

        this.commentSnippets = [];

        this.api = Api;

        this.setDispatcherKey([
                "COMMENT_FETCH",
                "COMMENT_STORE",
                "COMMENT_UPDATE",
                "COMMENT_DESTROY",
            ]);
    }

    
    fetchComments(snippetId) {
        this.request({
            method : this.api.comment.show.method,
            url    : this.api.comment.show.url.replace(":snippetId",snippetId),
            dispatcher : "COMMENT_FETCH",
            success: function(res) {
                console.log("fetch comment");
                this.setComments(snippetId, res);
            }
        });
    }

    store(snippetId, params) {
        this.request({
            method : this.api.comment.store.method,
            url    : this.api.comment.store.url.replace(":snippetId",snippetId),
            dispatcher : "COMMENT_STORE",
            success: function(res) {
                //console.log(res);
                this.appendComment(snippetId, res);
            }
        });
    }

    update(snippetId, commentId, params){
        this.request({
            method : this.api.comment.update.method,
            url    : this.api.comment.update.url.replace(":snippetId",snippetId).replace(":commentId",commentId),
            dispatcher : "COMMENT_UPDATE",
            success: function(res) {
                this.updateComment(snippetId, commentId, res);
            }
        });

/*
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
            });*/
    }

    destroy(snippetId, commentId){
        this.request({
            method : this.api.comment.destroy.method,
            url    : this.api.comment.destroy.url.replace(":snippetId",snippetId).replace(":commentId",commentId),
            dispatcher : "COMMENT_UPDATE",
            success: function(res) {
                this.destroyComment(snippetId, commentId);
            }
        });
/*
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
            });*/
    }

    setComments(snippetId, comments) {
        console.log(comments);
        this.setGroup(comments);
    }

    appendComment(snippetId, comment) {
        console.log(comment);
        this.appendData(comment);
    }

    getComment(snippetId, commentId) {
        this.getDataById(commentId);

        /*for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {

                for (var j = 0; j < this.commentSnippets[i].comments.length; j++) {
                    if(this.commentSnippets[i].comments[j].id === commentId) {
                        return this.commentSnippets[i].comments[j];    
                    }
                }
                
            }
        }

        return null;*/
    }

    destroyComment(snippetId, commentId) {
        this.disposeDataById(commentId);

        /*for (var i = 0; i < this.commentSnippets.length; i++) {
            if(this.commentSnippets[i].id === snippetId) {
                for (var j = 0; j < this.commentSnippets[i].comments.length; j++) {
                    if(this.commentSnippets[i].comments[j].id === commentId) {
                        this.commentSnippets[i].comments.splice(j,1);    
                        return;
                    }
                }
                
            }
        }*/
    }

    updateComment(snippetId, commentId, comment) {
        this.getAllData();
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
