
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    getDetails() {
        return {
            name: this.name,
            email: this.email
        };
    }
}

class Admin extends User {
    constructor(name, email, permissions) {
        super(name, email);
        this.permissions = permissions;
    }

    getDetails() {
        return {
            name: this.name,
            email: this.email,
            permissions: this.permissions
        };
    }
}

class Guest extends User {
    constructor(name, email) {
        super(name, email);
    }

    getDetails() {
        const map = new Map();
        map.set("name", this.name);
        map.set("email", this.email);
        return map;
    }
}

function printUserDetails(user) {
    console.log(user.getDetails());
}

printUserDetails(new User("John", "john@gmail.com"));
printUserDetails(new Admin("John", "john@gmail.com", ["create_users", "update_info", "delete_users"]));
printUserDetails(new Guest("John", "john@gmail.com"));