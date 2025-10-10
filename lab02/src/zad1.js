var Status;
(function (Status) {
    Status["Active"] = "active";
    Status["Inactive"] = "inactive";
})(Status || (Status = {}));
var data = {
    name: "Mikołaj",
    age: 23,
    isActive: true,
    scores: [5, 5, 4, 3, 4, 4, 4],
    status: Status.Active
};
var processData = function (data) {
    console.log("Name: [".concat(data.name, "] Status: [").concat(data.status, "]"));
    console.log(data.age >= 18 ? "Adult" : "Minor");
    var average = data.scores.reduce(function (acc, el) {
        acc += el;
        return acc;
    }, 0) / data.scores.length;
    console.log("Average ".concat(average));
};
processData(data);
