
class FileUploaderFactory {

    constructor ($http, $cookies) {
        'ngInject';

        this._cookies = $cookies;
        this._http = $http;
        this.maxSize = 1000000;
    }

    setMaximumSize(maximumSize) {
        this.maxSize = maximumSize;
    }

    upload(url, method, files, cb) {

        if(typeof cb !== 'function') {
            cb = function() {};
        }

        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            if(files[i].size > this.maxSize) {
                var data = {
                    errors : "ファイルサイズは1MB以下になります",
                };

                cb(false, data, 413);
                return;  
            }
            formData.append('files[]', files[i]);
        }

        this._http[method](url, formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            cb(true, res, 200);
        })
        .error(function(err){
            cb(false, err, xhr.status);
        });
    
    }   
}

export default FileUploaderFactory;
