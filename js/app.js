var app = angular.module("chart-builder",["ngDrag"]);

app.value("allData",{
    "values":{
        "Brand": {
            "Sales":{
                "Adidas": 3500,
                "Reebok": 4000,
                "Nike": 7999
            },
            "Orders":{
                "Adidas": 680,
                "Reebok": 700,
                "Nike": 500
            },
            "Revenue":{
                "Adidas": 4000,
                "Reebok": 12000,
                "Nike": 8000
            }
        },
        "Category": {
            "Sales":{
                "Laptop": 50000,
                "Mobile": 40000,
                "E-reader": 25000
            },
            "Orders":{
                "Laptop": 600,
                "Mobile": 300,
                "E-reader": 250
            },
            "Revenue":{
                "Laptop": 8000,
                "Mobile": 12000,
                "E-reader": 5000
            }
        }
    },
    "dimensions": ["Brand","Category"],
    "measures": ["Sales","Orders","Revenue"]
});

app.value("chartTypes",["column","bar","pie"]);


app.controller("mainController", ["allData","chartTypes","$scope",function (allData,chartTypes,$scope) {
    $scope.data = {};
    $scope.data.chooserDimensions = allData.dimensions;
    $scope.data.chosenDimension = undefined;
    $scope.data.chooserMeasures = allData.measures;
    $scope.data.chosenMeasure = undefined;

    $scope.chartTypes = chartTypes;
    $scope.chartTypeChosen = chartTypes[0];

    $scope.data.values = allData.values;

    $scope.allowDrop = function(ev,location) {
        // var prevLocation = ev.dataTransfer.getData("location");
        // if (checkValidDrop(prevLocation,location)){
            ev.preventDefault();
        // }
    };

    $scope.drag = function(ev,location) {
        ev.dataTransfer.setData("text", ev.target.textContent);
        ev.dataTransfer.setData("location", location);
    };

    $scope.drop = function(ev,location) {
        var prevLocation = ev.dataTransfer.getData("location");
        if (checkValidDrop(prevLocation,location)){
            ev.preventDefault();
            var value = ev.dataTransfer.getData("text");
            
            moveData(prevLocation,location,value);
        }
    };

    function checkValidDrop(prevLocation,curLocation){
        var prevContainer = prevLocation.split(".")[0];
        var prevType = prevLocation.split(".")[1];

        var curContainer = curLocation.split(".")[0];
        var curType = curLocation.split(".")[1];

        if ((prevContainer !== curContainer) && (prevType === curType)){
            return true;
        }
        else
        {
            return false;
        }
    }

    function moveData(prevLocation,curLocation,value){
        var mapLocationData = {
            "chooser.dimension":"chooserDimensions",
            "chooser.measure":"chooserMeasures",
            "chosen.dimension":"chosenDimension",
            "chosen.measure":"chosenMeasure"
        };

        var prevContainer = prevLocation.split(".")[0];
        var curContainer = curLocation.split(".")[0];

        var prevDataName = mapLocationData[prevLocation];
        var curDataName = mapLocationData[curLocation];

        if (prevContainer === "chooser"){
            var index = $scope.data[prevDataName].indexOf(value);
            if (index > -1) {
                $scope.data[prevDataName].splice(index, 1);
            }
        }
        else
        {
                        $scope.data[prevDataName] = undefined;   
        }

        if (curContainer === "chooser"){
            $scope.data[curDataName].push(value);
        }
        else
        {   
            prevValue = $scope.data[curDataName];
            if (prevValue){
                $scope.data[prevDataName].push(prevValue);
            }

            $scope.data[curDataName] = value;   
        }

    }

    $scope.$watchGroup(["data.values","data.chosenDimension","data.chosenMeasure","chartTypeChosen"],function(){
        if ($scope.data.chosenMeasure && $scope.data.chosenDimension){
            var tmpData = $scope.data.values[$scope.data.chosenDimension][$scope.data.chosenMeasure];
            var chartData = [];
            var keys = Object.keys(tmpData);
            var axisLabel;
            if ($scope.chartTypeChosen.toLowerCase() === "bar")
            {
                for (var i = keys.length - 1; i >= 0; i--) {
                    chartData.push({"y":keys[i],"x":tmpData[keys[i]]});
                }
                axisLabel = [$scope.data.chosenMeasure,$scope.data.chosenDimension];
            }
            else
            {
                for (var i = keys.length - 1; i >= 0; i--) {
                    chartData.push({"x":keys[i],"y":tmpData[keys[i]]});
                }   
                axisLabel = [$scope.data.chosenDimension,$scope.data.chosenMeasure];
            }

            drawChart($scope.chartTypeChosen,chartData,axisLabel);
        }
        else
        {
            cleanChart();
        }
    });
}]);
