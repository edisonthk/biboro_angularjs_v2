import FluxService from "../flux/flux.service";

class NotificationService extends FluxService{
    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        super.constructor($http, Dispatcher);

        this.api = Api;
        this.unreadMessage = false;

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

                this.updateUnreadMessage();
            }
        });
    }

    updateUnreadMessage() {
        this.unreadMessage = false;
        var notices = this.getAllData();
        for (var i = 0; i < notices.length; i++) {
            if(!notices[i].read) {
                this.unreadMessage = true;
                return;
            }
        }
    }

    markAsRead(noticeIds) {

        this.request({
            method : this.api.notification.read.method,
            url    : this.api.notification.read.url,
            dispatcher: "NOTICE_MARKED",
            data   : {
                noticeIds: noticeIds
            },
            success: function(res) {
                this.updateUnreadMessage();
            }
        });   
    }

    getAll(){
        return this.getAllData();
    }

    haveUnreadNotice() {
        return this.unreadMessage;
    }

}

export default NotificationService;
