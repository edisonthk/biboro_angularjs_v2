import BaseService from "../../base/base.service";

class NewsService extends BaseService{
    constructor($http,Dispatcher, Api) {
        
        this._http = $http;
        this._dispatcher = Dispatcher;
        this.api = Api;

        this.news = [];
        
        this.NEWS_FETCHALL = "NEWS_FETCHALL";
        this.NEWS_SHOW     = "NEWS_SHOW";

        // setTimeout(function() {

        //     scope.$apply();
        // });

    }
    
    fetchAll() {
        var self = this;

        var req = {
            method : self.api.news.index.method,
            url    : self.api.news.index.url,
        };

        self._http[req.method](req.url, req.data)
            .success(function(res){
                self.news = res.data;
                self._dispatcher.dispatch(self.NEWS_FETCHALL, {"success":true,"result":"success"});
            })
            .error(function(){
                console.log("error in workbook.strore.js");
                self._dispatcher.dispatch(self.NEWS_FETCHALL, {"success":false,"result":"fail to fetch workbooks."});
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
        return this.news;
    }

}

export default NewsService;
