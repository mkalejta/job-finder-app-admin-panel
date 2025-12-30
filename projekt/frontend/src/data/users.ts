import User from '../app/interface/user';
import { v4 as uuidv4 } from 'uuid';

export const users: User[] = [
    {
        id: uuidv4(),
        username: 'alicejohnson',
        email: 'alice.johnson@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        phoneNumber: 1234567890,
        profileDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        profilePhoto: undefined,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z')
    },
    {
        id: uuidv4(),
        username: 'bobsmith',
        email: 'bob.smith@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        phoneNumber: 2345678901,
        profileDescription: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        profilePhoto: undefined,
        createdAt: new Date('2023-01-03T10:00:00Z'),
        updatedAt: new Date('2023-01-04T10:00:00Z')
    },
    {
        id: uuidv4(),
        username: 'carolwilliams',
        email: 'carol.williams@example.com',
        firstName: 'Carol',
        lastName: 'Williams',
        phoneNumber: 3456789012,
        profileDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        profilePhoto: undefined,
        createdAt: new Date('2023-01-05T10:00:00Z'),
        updatedAt: new Date('2023-01-06T10:00:00Z')
    }
];