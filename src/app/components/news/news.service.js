import FluxService from "../flux/flux.service";

class NewsService extends FluxService{
    constructor($http,Dispatcher, Api) {
        'ngInject';
        
        super.constructor($http, Dispatcher);

        this.api = Api;

        this.setDispatcherKey([    
                "NEWS_FETCHALL",
                "NEWS_SEARCHED",
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

    search(query) {
        this.request({
            method : this.api.news.search.method,
            url    : this.api.news.search.url.replace(":query",encodeURIComponent(query)),
            dispatcher: [
                "NEWS_SEARCHED",
            ],
            success: function(res) {
                this.setGroup(res);
            }
        });
    }

    getAll(){
        return this.getAllData();
    }

}

export default NewsService;
