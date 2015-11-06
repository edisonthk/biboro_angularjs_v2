import FluxService from "../flux/flux.service";

class FeedbackService extends FluxService{

    constructor($http,Dispatcher, Api) {
        'ngInject';
        super($http, Dispatcher);

        this.api = Api;
        
        this.setDispatcherKey([    
                "FEEDBACK_SENT",
            ]);
    }
    
    send(message) {

        this.request({
            method : this.api.feedback.send.method,
            url    : this.api.feedback.send.url,
            data   : {message: message},
            dispatcher: [
                "FEEDBACK_SENT",
            ],
        });
    }

}

export default FeedbackService;
