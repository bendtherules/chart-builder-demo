var app = angular.module("chart-builder",["ngDrag","chart-builder.filters","chart-builder.directives","chart-builder.services"]);

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
                "Reebok": 900,
                "Nike": 500
            },
            "Revenue":{
                "Adidas": 4000,
                "Reebok": 1000,
                "Nike": 8000
            }
        },
        "Category": {
            "Sales":{
                "Laptop": 30000,
                "Mobile": 10000,
                "E-reader": 5000
            },
            "Orders":{
                "Laptop": 60,
                "Mobile": 300,
                "E-reader": 100
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


app.controller("mainController", ["allData","$scope",function (allData,$scope) {
    init();

    function init() {
        $scope.data = {};
        $scope.data.chooserDimensions = allData.dimensions;
        $scope.data.chosenDimension = undefined;
        $scope.data.chooserMeasures = allData.measures;
        $scope.data.chosenMeasure = undefined;

        $scope.data.values = allData.values;
    }

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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $scope.plotRandom = function () {
        var indexDimension = getRandomInt(0,($scope.data.chooserDimensions.length - 1));
        var indexMeasure = getRandomInt(0,($scope.data.chooserMeasures.length - 1));

        moveData("chooser.dimension","chosen.dimension", $scope.data.chooserDimensions[indexDimension]);
        moveData("chooser.measure","chosen.measure", $scope.data.chooserMeasures[indexMeasure]);
    }
}]);
