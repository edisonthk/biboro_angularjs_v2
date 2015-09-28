var Helper = {
    parseErrorMessagesAsHtml: function(error) {
        var errMessage = "<ul>";
        for(var key in error) {
            if(Array.isArray(error[key])) {
                for(var i = 0 ; i < error[key].length; i++) {
                    errMessage += "<li>" + error[key][i] + "</li>";    
                }
            }else {
                errMessage += "<li>"+error[key]+"</li>";
            }
            
        }
        errMessage += "</ul>";

        return errMessage;
    }  
};

export default Helper;