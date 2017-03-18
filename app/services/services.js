var app = angular.module("chart-builder.services",[]);

app.service("d3Tip", function () {
    this.tip = d3.tip();
});