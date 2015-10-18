import FluxService from "../flux/flux.service";

class NotificationService extends FluxService{
    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        super.constructor($http, Dispatcher);

        this.api = Api;

        this.setDispatcherKey([    
                "NOTICE_FETCHALL",
                "NOTICE_MARKED",
            ]);
        
    }
    
    fetchAll() {
        this.request({
            method : this.api.notification.index.method,
            url    : this.api.notification.index.url,
            dispatcher: "NOTICE_FETCHALL",
            success: function(res) {
                this.updateGroup(res);
            }
        });
    }

    markAsRead(noticeIds) {

        this.request({
            method : this.api.notification.read.method,
            url    : this.api.notification.read.url,
            dispatcher: "NOTICE_MARKED",
            data   : {
                noticeIds: noticeIds
            }
        });   
    }

    getAll(){
        return this.getAllData();
    }

}

export default NotificationService;
