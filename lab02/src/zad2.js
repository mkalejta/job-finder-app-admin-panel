var getProductSummary = function (product) {
    var summary = "ID: ".concat(product.id, "\nName: ").concat(product.name, "\nPrice: ").concat(product.price, " PLN");
    if ('fileSizeMB' in product && 'downloadLink' in product) {
        summary += "\nType: Digital\nFile size: ".concat(product.fileSizeMB, " MB\nDownload: ").concat(product.downloadLink);
    }
    else if ('weightKg' in product && 'dimensions' in product) {
        summary += "\nType: Physical\nWeight: ".concat(product.weightKg, " kg\nDimensions: ").concat(JSON.stringify(product.dimensions));
    }
    return summary;
};
console.log(getProductSummary({ id: 123, name: "The Art of Deal Making", price: 30, fileSizeMB: 50, downloadLink: "http://url.to.download" }));
console.log(getProductSummary({ id: 124, name: "The Art of Deal", price: 22, weightKg: 11, dimensions: { dimension1: 1, dimension2: 2 } }));
