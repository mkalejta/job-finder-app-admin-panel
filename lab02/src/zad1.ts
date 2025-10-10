enum Status {
    Active = 'active',
    Inactive = 'inactive'
}

interface Data {
    name: string,
    age: number,
    isActive: boolean,
    scores: number[],
    status: Status
}

const data: Data  = {
    name: "Mikołaj",
    age: 23,
    isActive: true,
    scores: [5, 5, 4, 3, 4, 4, 4],
    status: Status.Active
}

const processData = (data: Data) => {
    console.log(`Name: [${data.name}] Status: [${data.status}]`);
    console.log(data.age >= 18 ? "Adult" : "Minor");
    const average: number = data.scores.reduce((acc, el) => {
        acc += el;
        return acc;
    }, 0) / data.scores.length; 
    console.log(`Average ${average}`);
}

processData(data)