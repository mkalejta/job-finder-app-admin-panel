const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve("Zadanie 1 - 1000ms"), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve("Zadanie 2 - 500ms"), 500)),
  () => new Promise((resolve) => setTimeout(() => resolve("Zadanie 3 - 1500ms"), 1500)),
  () => new Promise((resolve) => setTimeout(() => resolve("Zadanie 4 - 700ms"), 700)),
  () => new Promise((resolve) => setTimeout(() => resolve("Zadanie 5 - 200ms"), 200)),
];

async function processQueue(tasks, maxConcurrent) {
  const results = [];
  let inProgress = 0;
  let currentTaskIndex = 0;

  return new Promise((resolve) => {
    function launchNext() {
      while (inProgress < maxConcurrent && currentTaskIndex < tasks.length) {
        const taskIndex = currentTaskIndex++;
        inProgress++;
        tasks[taskIndex]()
          .then((result) => {
            results.push(result);
          })
          .finally(() => {
            inProgress--;
            if (results.length === tasks.length) {
              resolve(results);
            } else {
              launchNext();
            }
          });
      }
    }

    launchNext();
  });
}
processQueue(tasks, 2).then((results) => {
  console.log(results);
});
