var api = {

    debug: true,

    env: 'stagging',

    // url or path to api
    host: {
        local: '/',
        stagging : 'http://localhost:8000/'
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
            index   : 'api/v1/snippet',
            show    : 'api/v1/snippet/:id',
            update  : 'api/v1/snippet/:id',
            destroy : 'api/v1/snippet/:id',
        },
        workbook: {
            index   : 'api/v1/workbook',
            show    : 'api/v1/workbook/:id',
            update  : 'api/v1/workbook/:id',
            destroy : 'api/v1/workbook/:id',
            rename  : 'api/v1/workbook/:id/rename',
        },
        account: {
            info: 'api/v1/account/userinfo/user',
            google_signin: 'api/v1/account/dev-signin/',
            signin:        'api/v1/account/signin?type=',
            signout:       'api/v1/account/signout',

        }
    }
};

api.api_stagging = api.api_production;

export default api;
