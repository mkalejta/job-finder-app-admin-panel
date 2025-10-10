var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Employee = /** @class */ (function () {
    function Employee(name, salary) {
        this.name = name;
        this.salary = salary;
    }
    Employee.prototype.getDetails = function () {
        return {
            name: this.name,
            salary: this.salary
        };
    };
    return Employee;
}());
var Manager = /** @class */ (function (_super) {
    __extends(Manager, _super);
    function Manager(name, salary, departament) {
        var _this = _super.call(this, name, salary) || this;
        _this.departament = departament;
        return _this;
    }
    Manager.prototype.getDetails = function () {
        return {
            name: this.name,
            salary: this.salary,
            departament: this.departament
        };
    };
    return Manager;
}(Employee));
var Developer = /** @class */ (function (_super) {
    __extends(Developer, _super);
    function Developer(name, salary, programmingLanguages) {
        var _this = _super.call(this, name, salary) || this;
        _this.programmingLanguages = programmingLanguages;
        return _this;
    }
    Developer.prototype.getDetails = function () {
        return {
            name: this.name,
            salary: this.salary,
            programmingLanguages: this.programmingLanguages
        };
    };
    return Developer;
}(Employee));
function printEmployeeDetails(person) {
    console.log(person.getDetails());
    console.log('\n');
}
var employee = new Employee("Jack", 10000);
var manager = new Manager("John", 21000, "security");
var developer = new Developer("Mark", 17000, ["Java", "Python"]);
printEmployeeDetails(employee);
printEmployeeDetails(manager);
printEmployeeDetails(developer);
