import apiConstant from './api.constant';

apiConstant.__tmp = apiConstant['api_'+apiConstant.env];
var _host = apiConstant.host[apiConstant.env]

for(var path in apiConstant.__tmp) {
    if(typeof apiConstant.__tmp[path] === 'string') {
        apiConstant.__tmp[path] = _host + apiConstant.__tmp[path];
    }else{
        for(var path1 in apiConstant.__tmp[path]) {
            if(typeof apiConstant.__tmp[path][path1] === 'string') {
                apiConstant.__tmp[path][path1] = _host + apiConstant.__tmp[path][path1];
            }else{
                for(var path2 in apiConstant.__tmp[path][path1]) {
                    apiConstant.__tmp[path][path1][path2] = _host + apiConstant.__tmp[path][path1][path2];
                }
            }
        }
    }
}

for(var key in apiConstant.__tmp) {
    apiConstant[key] = apiConstant.__tmp[key];
}


export default apiConstant;
