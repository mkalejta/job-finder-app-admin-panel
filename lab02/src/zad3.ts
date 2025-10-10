interface EmployeeDto {
    name: string,
    salary: number
}

class Employee {
    protected name: string;
    protected salary: number;

    public constructor(name: string, salary: number) {
        this.name = name;
        this.salary = salary;
    }

    public getDetails(): EmployeeDto {
        return {
            name: this.name,
            salary: this.salary
        }
    }

}

interface ManagerDto {
    name: string,
    salary: number,
    departament: string
}

class Manager extends Employee {
    public departament: string;

    public constructor(name: string, salary: number, departament: string) {
        super(name, salary);
        this.departament = departament;
    }

    public override getDetails(): ManagerDto {
        return {
            name: this.name,
            salary: this.salary,
            departament: this.departament
        }
    }
}

interface DeveloperDto {
    name: string,
    salary: number,
    programmingLanguages: string[]
}

class Developer extends Employee {
    public programmingLanguages: string[];

    public constructor(name: string, salary: number, programmingLanguages: string[]) {
        super(name, salary);
        this.programmingLanguages = programmingLanguages;
    }

    public override getDetails(): DeveloperDto {
        return {
            name: this.name,
            salary: this.salary,
            programmingLanguages: this.programmingLanguages
        }
    }
}

function printEmployeeDetails(person: Employee) {
    console.log(person.getDetails());
    console.log('\n');
}

const employee: Employee = new Employee (
    "Jack",
    10000
)

const manager: Manager = new Manager (
    "John",
    21000,
    "security"
)

const developer: Developer = new Developer (
    "Mark",
    17000,
    ["Java", "Python"]
)

printEmployeeDetails(employee);
printEmployeeDetails(manager);
printEmployeeDetails(developer);