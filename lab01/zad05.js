async function fetchWithRetries(url, retries) {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
        console.log(`${attempt} attempt.`)
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Http error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (err) {
            lastError = err;
            if (attempt === retries) {
                throw lastError;
            }
        }
        await new Promise(res => setTimeout(res, 1000));
    }
}

fetchWithRetries('https://api.example.com/data', 3)
  .then(data => console.log(data))
  .catch(error => console.error('Failed to fetch data:', error));