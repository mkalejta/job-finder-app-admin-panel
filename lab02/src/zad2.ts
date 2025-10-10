interface Product {
    id: number,
    name: string,
    price: number
}

interface DigitalProduct extends Product {
    fileSizeMB: number,
    downloadLink: string
}

interface PhysicalProduct extends Product {
    weightKg: number,
    dimensions: object
}

const getProductSummary = (product: DigitalProduct | PhysicalProduct) => {
    let summary = `ID: ${product.id}\nName: ${product.name}\nPrice: ${product.price} PLN`;
    if ('fileSizeMB' in product && 'downloadLink' in product) {
        summary += `\nType: Digital\nFile size: ${product.fileSizeMB} MB\nDownload: ${product.downloadLink}`;
    } else if ('weightKg' in product && 'dimensions' in product) {
        summary += `\nType: Physical\nWeight: ${product.weightKg} kg\nDimensions: ${JSON.stringify(product.dimensions)}`;
    }
    return summary;
}

console.log(getProductSummary({ id: 123, name: "The Art of Deal Making", price: 30, fileSizeMB: 50, downloadLink: "http://url.to.download"}));
console.log(getProductSummary({ id: 124, name: "The Art of Deal", price: 22, weightKg: 11, dimensions: { dimension1: 1, dimension2: 2}}));