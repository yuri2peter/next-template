fetchWithRetry('http://localhost:3000/api/init')
  .then((response) => response.text())
  .then((data) => console.log(data))
  .catch((error) => console.error('Can not init:', error));

async function fetchWithRetry(url, options = {}, retries = 20, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      if (i === retries - 1) throw error;
    }
    await sleep(delay);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
