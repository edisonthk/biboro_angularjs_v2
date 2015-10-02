import BaseService from "../../base/base.service";

class FeedbackService extends BaseService{
    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        this._http = $http;
        this._dispatcher = Dispatcher;
        this.api = Api;
        
        this.FEEDBACK_SENT = "FEEDBACK_SENT";
    }
    
    send(message) {
        var self = this;

        var req = {
            method : self.api.feedback.send.method,
            url    : self.api.feedback.send.url,
            data   : {message: message},
        };

        self._http[req.method](req.url, req.data)
            .success(function(res){
                self._dispatcher.dispatch(self.FEEDBACK_SENT, {"success":true,"result":"success"});
            })
            .error(function(){
                self._dispatcher.dispatch(self.FEEDBACK_SENT, {"success":false,"result":"fail to send feedback."});
            });

    }

}

export default FeedbackService;
