export interface Address {
    street: string,
    city: string,
    postalCode: string
}

export interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    address: Address[]
}