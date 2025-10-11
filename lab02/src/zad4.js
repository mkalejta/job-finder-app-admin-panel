var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function mergeArrays(tab1, tab2) {
    if (!Array.isArray(tab1) || !Array.isArray(tab2)) {
        throw new Error('Oba argumenty muszą być tablicami');
    }
    if (tab1.length > 0 && tab2.length > 0) {
        var expectedType = typeof tab1[0];
        for (var i = 0; i < tab1.length; i++) {
            if (typeof tab1[i] !== expectedType) {
                throw new Error("Pierwsza tablica zawiera elementy r\u00F3\u017Cnych typ\u00F3w");
            }
        }
        for (var i = 0; i < tab2.length; i++) {
            if (typeof tab2[i] !== expectedType) {
                throw new Error("Tablice musz\u0105 zawiera\u0107 elementy tego samego typu. Oczekiwano: ".concat(expectedType, ", znaleziono: ").concat(typeof tab2[i]));
            }
        }
    }
    return __spreadArray(__spreadArray([], tab1, true), tab2, true);
}
console.log(mergeArrays([1, 2, 3], [4, 5, 6]));
console.log(mergeArrays(['a', 'b'], ['c', 'd']));
// Test przypadków błędnych
try {
    console.log(mergeArrays([1, 2, 3], [4, 5, '6']));
}
catch (error) {
    console.log('Błąd:', error.message);
}
try {
    console.log(mergeArrays([1, 2, 3], ['a', 'b']));
}
catch (error) {
    console.log('Błąd:', error.message);
}
