/**
 * Created by Felix on 2016/5/4.
 */
var config = {};
$.ajax({
    url: "../config.json",
    dataType: "json",
    async: false,
    success: function(json){
        config = json;
    }
});