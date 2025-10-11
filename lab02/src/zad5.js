function validateObject(obj, schema) {
    if (typeof schema !== "object" || schema === null) {
        throw new Error('Schema has to be an object');
    }
    if (obj === null) {
        return false;
    }
    var objectKeys = Object.keys(obj);
    var schemaKeys = Object.keys(schema);
    for (var _i = 0, schemaKeys_1 = schemaKeys; _i < schemaKeys_1.length; _i++) {
        var key = schemaKeys_1[_i];
        if (objectKeys.indexOf(key) === -1) {
            return false;
        }
        var actualType = typeof obj[key];
        var expectedType = schema[key];
        if (actualType !== expectedType) {
            return false;
        }
    }
    // Sprawdzenie czy obiekt nie ma dodatkowych kluczy
    for (var _a = 0, objectKeys_1 = objectKeys; _a < objectKeys_1.length; _a++) {
        var key = objectKeys_1[_a];
        if (schemaKeys.indexOf(key) === -1) {
            return false; // Obiekt ma dodatkowy klucz
        }
    }
    return true;
}
var obj = {
    nickname: "nickname",
    email: "email",
    age: 23,
    password: "string",
    isSubscriber: true
};
var obj2 = {
    nickname: "nickname",
    email: "email",
    age: "23",
    password: "string",
    isSubscriber: true
};
var obj3 = {
    nickname: "nickname",
    email: "email",
    age: 23,
    password: "string",
};
var obj4 = {
    nickname: "nickname",
    email: "email",
    age: 23,
    password: "string",
    isSubscriber: true,
    extraKey: "extra" // Dodatkowy klucz
};
var schema = {
    nickname: "string",
    email: "string",
    age: "number",
    password: "string",
    isSubscriber: "boolean"
};
console.log("obj1 (poprawny):", validateObject(obj, schema)); // true
console.log("obj2 (błędny typ):", validateObject(obj2, schema)); // false - age to string zamiast number
console.log("obj3 (brakuje klucza):", validateObject(obj3, schema)); // false - brakuje isSubscriber
console.log("obj4 (dodatkowy klucz):", validateObject(obj4, schema)); // false - ma dodatkowy klucz
