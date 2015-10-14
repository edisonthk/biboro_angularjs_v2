import FluxService from "../flux/flux.service";

class NewsService extends FluxService{
    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        super.constructor($http, Dispatcher);

        this.api = Api;

        this.setDispatcherKey([    
                "NEWS_FETCHALL",
                "NEWS_SHOW",
            ]);
        
    }
    
    fetchAll() {
        this.disposeAllData();
        
        this.request({
            method : this.api.news.index.method,
            url    : this.api.news.index.url,
            dispatcher: "NEWS_FETCHALL",
            success: function(res) {
                this.setGroup(res.news);
            }
        });
    }

    show(id){
        var self= this;

        var req = {
            method : self.api.news.show.method,
            url    : self.api.news.show.url.replace(":id",id),
        };

        self._http[req.method](req.url, req.data)
            .success(function(response){
                
                self._dispatcher.dispatch(self.NEWS_SHOW, {"success":true,"result":"success"});
                
            })
            .error(function(){
                self._dispatcher.dispatch(self.NEWS_SHOW, {"success":false,"result":"fail to show workbooks."});
                
            });
    }

    getAll(){
        return this.getAllData();
    }

}

export default NewsService;
