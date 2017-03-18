var app = angular.module("chart-builder.filters",[]);

app.filter("sentencecase", function () {
    return function (str) {
       if (typeof(str)  === "string"){
            str = str[0].toUpperCase() + str.slice(1);
       }
       return str;
    };
});