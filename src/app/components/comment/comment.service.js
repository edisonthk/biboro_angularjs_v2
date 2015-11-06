import FluxService from "../flux/flux.service";

class CommentService extends FluxService {

    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        super($http, Dispatcher);

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
                this.setComments(res);
            }
        });
    }

    store(snippetId, params) {
        this.request({
            method : this.api.comment.store.method,
            url    : this.api.comment.store.url.replace(":snippetId",snippetId),
            dispatcher : "COMMENT_STORE",
            data   : params,
            success: function(res) {
                this.appendComment(res);
            }
        });
    }

    update(snippetId, params){
        this.request({
            method : this.api.comment.update.method,
            url    : this.api.comment.update.url.replace(":snippetId",snippetId).replace(":commentId",commentId),
            data   : params,
            dispatcher : "COMMENT_UPDATE",
            success: function(res) {
                this.updateComment(snippetId, res);
            }
        });
    }

    destroy(snippetId, commentId){
        this.request({
            method : this.api.comment.destroy.method,
            url    : this.api.comment.destroy.url.replace(":snippetId",snippetId).replace(":commentId",commentId),
            dispatcher : "COMMENT_UPDATE",
            success: function(res) {
                this.destroyComment(commentId);
            }
        });
    }

    setComments(comments) {
        this.setGroup(comments);
    }

    appendComment(comment) {
        this.appendData(comment);
    }

    getComments() {
        return this.getAllData();
    }

    getComment(commentId) {
        return this.getDataById(commentId);
    }

    destroyComment(commentId) {
        this.disposeDataById(commentId);
    }

    updateComment(snippetId, comment) {
        if(parseInt(comment.snippet_id) === parseInt(snippetId)) {
            setDataInsideGroup(comment);
        }
    }

    // getCommentGroup(snippetId) {
    //     for (var i = 0; i < this.commentSnippets.length; i++) {
    //         if(this.commentSnippets[i].id === snippetId) {
    //             return this.commentSnippets[i];
    //         }
    //     }
    //     // dummy data
    //     return {id:0, comments:[]};
    // }

    // getCommentsBySnippetId(snippetId) {
    //     return this.getCommentGroup(snippetId).comments;
    // }

}

export default CommentService;
