
import FluxController from "../flux/flux.controller";

class CommentController extends FluxController{
    constructor ($scope,Dispatcher, CommentService, AccountService) {
        'ngInject';
        
        super.constructor($scope, Dispatcher);

        this.IN_PROGRESS = "IN_PROGRESS";
        this.ERROR       = "ERROR";
        this.DONE        = "DONE";

        this.comment = CommentService;
        this.account = AccountService;

        this.registerCallbacks({
            COMMENT_UPDATE  : this.updateCallback,
            COMMENT_DESTROY : this.destroyCallback,
            COMMENT_STORE   : this.storeCallback,

        }); 

        this._scope.$watch('snippet', this.snippetUpdatedCallback.bind(this));

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
        if(this.snippet.id) {
            this.comment.fetchComments(snippet.id);    
        }
        
        this.user   = this.account.getUser();

        //console.log(this.user);
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
        console.log(this.comment.getComments());
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
