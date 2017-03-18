var app = angular.module("chart-builder.filters",[]);

app.filter("sentencecase", function () {
    return function (strToUse) {
       if (typeof(strToUse)  === "string"){
            strToUse = strToUse[0].toUpperCase() + strToUse.slice(1);
       }
       return strToUse;
    };
});