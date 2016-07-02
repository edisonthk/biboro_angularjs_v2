var api = {

    debug: true,

    env: 'stagging',

    // url or path to api
    host: {
        local: '/',
        stagging : domain === 'undefined' ? 'http://api.biboro.edisonthk.com/' : domain,
        // stagging : 'http://localhost:8000/'
    },

    // api will be used as defined api_[env]
    api_local: {
        // development api
        snippet: {
            index   : 'api/v1/snippet/index.json',
            show    : 'api/v1/snippet/:id.json',
            update  : 'api/v1/snippet/:id.json',
            destroy : 'api/v1/snippet/:id.json',
        },
        workbook: {
            index   : 'api/v1/workbook/index.json',
            show    : 'api/v1/workbook/:id.json',
            update  : 'api/v1/workbook/:id.json',
            destroy : 'api/v1/workbook/:id.json',
        },
        account: {
            info: 'api/v1/account/userinfo/user.json',

        }
    },

    api_production: {
        // api in production list
        snippet: {
            index   : {method: 'get'   , url:'api/v1/snippet'},
            show    : {method: 'get'   , url:'api/v1/snippet/:id'},
            store   : {method: 'post'  , url:'api/v1/snippet'},
            update  : {method: 'put'   , url:'api/v1/snippet/:id'},
            destroy : {method: 'delete', url:'api/v1/snippet/:id'},
            fork    : {method: 'put'    ,url:'api/v1/snippet/fork'},
        },
        news: {
            index   : {method: 'get'    ,url:'api/v1/news'} ,
            show    : {method: 'get'    ,url:'api/v1/news/:id'} ,
            search  : {method: 'get'    ,url:'api/v1/search?kw=:query'},
        },  
        workbook: {
            index   : {method: 'get'    ,url:'api/v1/workbook'},
            show    : {method: 'get'    ,url:'api/v1/workbook/:id'},
            search  : {method: 'get'    ,url:'api/v1/workbook/:id/search?q=:query'},
            store   : {method: 'post'   ,url:'api/v1/workbook'},
            update  : {method: 'put'    ,url:'api/v1/workbook/:id'},
            destroy : {method: 'delete' ,url:'api/v1/workbook/:id'},
            order   : {method: 'put'    ,url:'api/v1/workbook/order'},
        },
        account: {
            info:   {method: 'get', url:'api/v1/account/userinfo'},
            login:  'auth/login',
            logout: 'auth/logout',
        },
        comment: {
            show    : {method: 'get'    ,url:'api/v1/snippet/:snippetId/comment'},
            store   : {method: 'post'   ,url:'api/v1/snippet/:snippetId/comment'},
            update  : {method: 'put'    ,url:'api/v1/snippet/:snippetId/comment/:commentId'},
            destroy : {method: 'delete' ,url:'api/v1/snippet/:snippetId/comment/:commentId'},
        },
        feedback: {
            send     : {method: 'post', url:'api/v1/feedback'}
        },
        image: {
            upload   : {method: 'post', url:'api/v1/images/upload'}
        },
        notification: {
            index    : {method: 'get', url:'api/v1/notification'},
            read     : {method: 'post', url:'api/v1/notification'},
        },
    }
};

api.api_stagging = api.api_production;

export default api;
