
const deliveries = [
    { id: 1, status: 'completed', amount: 100 },
    { id: 2, status: 'pending', amount: 200 },
    { id: 3, status: 'completed', amount: 150 },
    { id: 4, status: 'canceled', amount: 50 },
    { id: 5, status: 'completed', amount: 300 },
    { id: 6, status: 'pending', amount: 400 },
    { id: 7, status: 'completed', amount: 250 },
    { id: 8, status: 'canceled', amount: 100 },
    { id: 9, status: 'completed', amount: 350 },
    { id: 10, status: 'pending', amount: 150 },
    { id: 11, status: 'completed', amount: 400 },
    { id: 12, status: 'canceled', amount: 200 },
    { id: 13, status: 'completed', amount: 500 },
    { id: 14, status: 'pending', amount: 300 },
    { id: 15, status: 'completed', amount: 450 },
]



const transformData = (data, transformFn) => {
    const filteredData = data.filter(delivery => delivery.status === 'completed');
    const transformedData = filteredData.map(transformFn);
    const total = transformedData.reduce((sum, delivery) => {
        return sum + delivery.amount;
    }, 0);
    return total;
};

const transformFn = (delivery) => ({
    id: delivery.id,
    status: delivery.status,
    amount: delivery.amount * 1.1 // Adding 10% tax
});

const totalAmount = transformData(deliveries, transformFn);
console.log(`Total amount for completed deliveries (with tax): ${totalAmount}`);