
objects = [
    { id: 1, name: 'John', value: 25, active: true },
    { id: 2, name: 'Jane', value: 30, active: false },
    { id: 3, name: 'Doe', value: 20, active: true },
    { id: 4, name: 'Smith', value: 15, active: false },
    { id: 5, name: 'Emily', value: 35, active: true }
];

const processData = (arr) => {
    let object = {
        sumOfValuesForActiveAccounts: 0,
        reversedNames: [],
        maxId: null,
        sumOfValuesWithNameLongerThanThree: 0
    };

    arr.forEach(item => {
        if (item.active) {
            object.sumOfValuesForActiveAccounts += item.value
        }
        if (item.name.length > 3) {
            object.sumOfValuesWithNameLongerThanThree += item.value
        }
        object.reversedNames.push(item.name.split('').reverse().join(''))
        if (object.maxId === null || item.id > object.maxId) {
            object.maxId = item.id
        }
    });
    return object;
}

console.log(processData(objects));