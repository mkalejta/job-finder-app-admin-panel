
const products = [
  { product: 'A', region: 'South', sales: 150 },
  { product: 'B', region: 'North', sales: 200 },
  { product: 'B', region: 'South', sales: 250 },
  { product: 'C', region: 'North', sales: 300 },
  { product: 'A', region: 'East', sales: 120 },
  { product: 'B', region: 'East', sales: 220 },
  { product: 'C', region: 'East', sales: 320 },
  { product: 'C', region: 'South', sales: 350 },
  { product: 'A', region: 'West', sales: 130 },
  { product: 'B', region: 'West', sales: 230 },
  { product: 'C', region: 'West', sales: 330 },
  { product: 'D', region: 'North', sales: 400 },
  { product: 'D', region: 'South', sales: 450 },
  { product: 'D', region: 'East', sales: 420 },
];

function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}

function getDistinctProductsSelledInAllRegions(products) {
    const groupedByProduct = groupBy(products, 'product');
    const regions = new Set(products.map(item => item.region));
    const distinctProducts = [];
    for (const product in groupedByProduct) {
        const productRegions = new Set(groupedByProduct[product].map(item => item.region));
        if (regions.size === productRegions.size && [...regions].every(region => productRegions.has(region))) {
            const sum = groupedByProduct[product].reduce((acc, item) => acc + item.sales, 0);
            distinctProducts.push({ product, totalSales: sum });
        }
    }
    return distinctProducts;
};

console.log(getDistinctProductsSelledInAllRegions(products));

