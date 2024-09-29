let extractedData = null;

document.getElementById('extract-layout').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: extractLayout,
      },
      (results) => {
        extractedData = results[0].result;
        document.getElementById('output').textContent = JSON.stringify(extractedData, null, 2);
        document.getElementById('convert-grid').disabled = false; // Enable the convert button
      }
    );
  });
});

document.getElementById('convert-grid').addEventListener('click', () => {
  if (!extractedData) return;

  const totalCells = extractedData.length;
  const gridSize = Math.sqrt(totalCells);
  const grid = [];

  for (let row = 0; row < gridSize; row++) {
    const rowArray = [];
    for (let col = 0; col < gridSize; col++) {
      const idx = row * gridSize + col;
      const cell = extractedData.find(cell => parseInt(cell.idx) === idx);
      rowArray.push(cell ? cell.color : 0); // Default to 0 if no cell found
    }
    grid.push(rowArray);
  }

  // Format the grid output as per your requirement
  const gridOutput = grid.map(row => JSON.stringify(row)).join(',\n');
  document.getElementById('output').textContent = gridOutput;
});

function extractLayout() {
  const layout = [];
  const cells = document.querySelectorAll('#queens-grid .queens-cell');

  cells.forEach((cell) => {
    const colorClass = cell.className.match(/cell-color-(\d+)/);
    const cellIdx = cell.getAttribute('data-cell-idx');
    if (colorClass) {
      layout.push({ idx: cellIdx, color: parseInt(colorClass[1], 10) });
    }
  });

  return layout;
}
