
class CommentController {
    constructor ($scope, CommentService, AccountService) {
        this.IN_PROGRESS = "IN_PROGRESS";
        this.ERROR       = "ERROR";
        this.DONE        = "DONE";

        this.scope   = $scope;
        this.comment = CommentService;
        this.account = AccountService;



        this.scope.$watch('snippet', this.snippetUpdatedCallback.bind(this));
        this.comment.registerFetchCallback(this.fetchCallback.bind(this));
        this.comment.registerStoreCallback(this.storeCallback.bind(this));
        this.comment.registerUpdateCallback(this.updateCallback.bind(this));
        this.comment.registerDestroyCallback(this.destroyCallback.bind(this));


        this.status   = this.IN_PROGRESS;
        this.snippet = null;
        this.comments = [];
        this.editor   = {
            text: "",
        };
    }


    snippetUpdatedCallback(snippet) {
        if(!snippet) {
            this.status = this.ERROR;
            return;
        }

        this.status = this.IN_PROGRESS;
        this.snippet = snippet;
        this.comment.fetchComments(snippet.id);
        this.user   = this.account.getUser();
    }


    fetchCallback(parameters) {
        this.status = this.DONE;
        this.comments = this.comment.getCommentsBySnippetId(this.snippet.id);
        console.log(this.snippet.id);
    }

    submit() {
        var params = {
            comment: this.editor.text,
        };
        this.comment.store(this.snippet.id ,params);
    }

    destroy(comment) {
        this.comment.destroy(this.snippet.id, comment.id);
    }

    storeCallback(parameters) {
        if(parameters.success) {
            this.editor.text = "";
            // this.comments.push(parameters.response);    
        }else{
            console.log("errors");
        }
    }

    updateCallback(parameters) {
        
    }

    destroyCallback(parameters) {
        // console.log(this.comment.getCommentsBySnippetId(this.snippet.id));
        // this.comments = this.comment.getCommentsBySnippetId(this.snippet.id);
    }

}

export default CommentController;
