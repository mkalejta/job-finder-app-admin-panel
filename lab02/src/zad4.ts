
function mergeArrays<T>(tab1: T[], tab2: T[]): T[] {
    if (!Array.isArray(tab1) || !Array.isArray(tab2)) {
        throw new Error('Oba argumenty muszą być tablicami');
    }
    
    if (tab1.length > 0 && tab2.length > 0) {
        const expectedType = typeof tab1[0];
        
        for (let i = 0; i < tab1.length; i++) {
            if (typeof tab1[i] !== expectedType) {
                throw new Error(`Pierwsza tablica zawiera elementy różnych typów`);
            }
        }
        
        for (let i = 0; i < tab2.length; i++) {
            if (typeof tab2[i] !== expectedType) {
                throw new Error(`Tablice muszą zawierać elementy tego samego typu. Oczekiwano: ${expectedType}, znaleziono: ${typeof tab2[i]}`);
            }
        }
    }
    
    return [...tab1, ...tab2];
}

console.log(mergeArrays([1, 2, 3], [4, 5, 6]));
console.log(mergeArrays(['a', 'b'], ['c', 'd']));

// Test przypadków błędnych
try {
    console.log(mergeArrays([1, 2, 3], [4, 5, '6'] as any));
} catch (error) {
    console.log('Błąd:', (error as Error).message);
}

try {
    console.log(mergeArrays([1, 2, 3] as any, ['a', 'b'] as any));
} catch (error) {
    console.log('Błąd:', (error as Error).message);
}