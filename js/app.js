var app = angular.module("chart-builder",["ngDrag"]);

app.value("allData",{
    "values":{
        "Brand" : {
            "Nike": {
                "Sales":5000,
                "Orders":6,
                "Revenue":800
            },
            "Adidas": {
                "Sales":4500,
                "Orders":3,
                "Revenue":753
            },
            "Reebok": {
                "Sales":7120,
                "Orders":12,
                "Revenue":1200
            }
        },
        "Category" : {
            "Laptop": {
                "Sales":50000,
                "Orders":600,
                "Revenue":8000
            },
            "Mobile": {
                "Sales":40000,
                "Orders":300,
                "Revenue":12000
            },
            "E-reader": {
                "Sales":8000,
                "Orders":50,
                "Revenue":800
            }
        }
    },
    "dimensions": ["Brand","Category"],
    "measures": ["Sales","Orders","Revenue"]
});

app.controller("mainController", ["allData","$scope",function (allData,$scope) {
    $scope.data = {};
    $scope.data.chooserDimensions = allData.dimensions;
    $scope.data.chosenDimension = undefined;
    $scope.data.chooserMeasures = allData.measures;
    $scope.data.chosenMeasure = undefined;

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

}]);
