interface Schema {
    nickname: "string",
    email: "string",
    age: "number",
    password: "string",
    isSubscriber: "boolean"
}


function validateObject<T>(obj: object, schema: T): boolean {
    if (typeof schema !== "object" || schema === null) {
        throw new Error('Schema has to be an object');
    }

    if (obj === null) {
        return false;
    }

    const objectKeys = Object.keys(obj);
    const schemaKeys = Object.keys(schema);

    for (const key of schemaKeys) {
        if (objectKeys.indexOf(key) === -1) {
            return false;
        }
        
        const actualType = typeof (obj as any)[key];
        const expectedType = (schema as any)[key];
        
        if (actualType !== expectedType) {
            return false;
        }
    }

    // Sprawdzenie czy obiekt nie ma dodatkowych kluczy
    for (const key of objectKeys) {
        if (schemaKeys.indexOf(key) === -1) {
            return false; // Obiekt ma dodatkowy klucz
        }
    }

    return true;
}

const obj: object = {
    nickname: "nickname",
    email: "email",
    age: 23,
    password: "string",
    isSubscriber: true
}

const obj2: object = {
    nickname: "nickname",
    email: "email",
    age: "23",
    password: "string",
    isSubscriber: true
}

const obj3: object = {
    nickname: "nickname",
    email: "email",
    age: 23,
    password: "string",
}

const obj4: object = {
    nickname: "nickname",
    email: "email", 
    age: 23,
    password: "string",
    isSubscriber: true,
    extraKey: "extra" // Dodatkowy klucz
}

const schema: Schema = {
    nickname: "string",
    email: "string",
    age: "number",
    password: "string",
    isSubscriber: "boolean"
}

console.log("obj1 (poprawny):", validateObject(obj, schema)); // true
console.log("obj2 (błędny typ):", validateObject(obj2, schema)); // false - age to string zamiast number
console.log("obj3 (brakuje klucza):", validateObject(obj3, schema)); // false - brakuje isSubscriber
console.log("obj4 (dodatkowy klucz):", validateObject(obj4, schema)); // false - ma dodatkowy klucz