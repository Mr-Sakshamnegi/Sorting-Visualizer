let array = [];
let barsContainer = document.getElementById('bars-container');
let sortSpeed = 100; // Default sorting speed (ms), assuming 100ms is the slowest speed
let arraySize = 50; // Default array size

// Generate a new array with random values
function generateArray() {
  array = [];
  barsContainer.innerHTML = '';

  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 250) + 1);
    const bar = document.createElement('div');
    bar.style.height = `${array[i]}px`;
    bar.classList.add('bar');
    barsContainer.appendChild(bar);
  }
}

// Reset the array and regenerate
function resetArray() {
  generateArray();
}

// Update the speed of sorting
function updateSpeed(value) {
  sortSpeed = 101 - value; // Invert the value to make 1 the fastest and 100 the slowest
}

// Update the size of array and regenerate
function updateArraySize(value) {
  arraySize = value;
  generateArray();
}

// Helper function to delay execution
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble sort algorithm
async function bubbleSort() {
  for (let i = 0; i < arraySize; i++) {
    for (let j = 0; j < arraySize - i - 1; j++) {
      await sleep(sortSpeed);

      // Visualize the comparison
      visualizeComparison(j, j + 1);

      // Swap if necessary
      if (array[j] > array[j + 1]) {
        swap(j, j + 1);
      }

      // Revert color back to default
      revertColor(j, j + 1);
    }
  }
}

// Selection sort algorithm
async function selectionSort() {
  for (let i = 0; i < arraySize - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arraySize; j++) {
      await sleep(sortSpeed);

      // Visualize the comparison
      visualizeComparison(minIndex, j);

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    // Swap elements
    if (minIndex !== i) {
      swap(minIndex, i);
    }

    // Revert color back to default
    revertColor(minIndex, i);
  }
}

// Insertion sort algorithm
async function insertionSort() {
  for (let i = 1; i < arraySize; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      await sleep(sortSpeed);

      // Visualize the comparison
      visualizeComparison(j + 1, j);

      // Move elements greater than key one position ahead
      array[j + 1] = array[j];

      // Update heights of bars
      updateBarHeight(j + 1, array[j]);

      j--;
    }

    array[j + 1] = key;
    updateBarHeight(j + 1, key);

    // Revert color back to default
    revertColor(j + 1, j);
  }
}

// Merge sort algorithm
async function mergeSort() {
  await mergeSortRecursive(0, arraySize - 1);
}

async function mergeSortRecursive(l, r) {
  if (l >= r) {
    return;
  }

  let m = l + Math.floor((r - l) / 2);

  await mergeSortRecursive(l, m);
  await mergeSortRecursive(m + 1, r);

  await merge(l, m, r);
}

async function merge(l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = new Array(n1);
  let R = new Array(n2);

  for (let i = 0; i < n1; i++) {
    L[i] = array[l + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = array[m + 1 + j];
  }

  let i = 0, j = 0, k = l;

  while (i < n1 && j < n2) {
    await sleep(sortSpeed);

    if (L[i] <= R[j]) {
      array[k] = L[i];
      updateBarHeight(k, L[i]);
      i++;
    } else {
      array[k] = R[j];
      updateBarHeight(k, R[j]);
      j++;
    }

    k++;
  }

  while (i < n1) {
    array[k] = L[i];
    updateBarHeight(k, L[i]);
    i++;
    k++;
  }

  while (j < n2) {
    array[k] = R[j];
    updateBarHeight(k, R[j]);
    j++;
    k++;
  }
}

// Quick sort algorithm
async function quickSort() {
  await quickSortRecursive(0, arraySize - 1);
}

async function quickSortRecursive(low, high) {
  if (low < high) {
    let pi = await partition(low, high);

    await quickSortRecursive(low, pi - 1);
    await quickSortRecursive(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    await sleep(sortSpeed);

    if (array[j] < pivot) {
      i++;
      swap(i, j);
    }

    // Visualize the comparison
    visualizeComparison(i, j);

    // Revert color back to default
    revertColor(i, j);
  }

  swap(i + 1, high);
  return i + 1;
}

// Heap sort algorithm
async function heapSort() {
  let n = arraySize;

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    await sleep(sortSpeed);

    // Move current root to end
    swap(0, i);

    // call max heapify on the reduced heap
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  let largest = i; // Initialize largest as root
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // If left child is larger than root
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  // If right child is larger than largest so far
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  // If largest is not root
  if (largest !== i) {
    swap(i, largest);

    // Recursively heapify the affected sub-tree
    await heapify(n, largest);
  }

  // Visualize the comparison
  visualizeComparison(i, largest);

  // Revert color back to default
  revertColor(i, largest);
}

// Helper functions for visualization
function visualizeComparison(index1, index2) {
  const bars = document.querySelectorAll('.bar');
  bars[index1].style.backgroundColor = '#ff6347';
  bars[index2].style.backgroundColor = '#ff6347';
}

function revertColor(index1, index2) {
  const bars = document.querySelectorAll('.bar');
  bars[index1].style.backgroundColor = '#3498db';
  bars[index2].style.backgroundColor = '#3498db';
}

function swap(index1, index2) {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;

  const bars = document.querySelectorAll('.bar');
  let tempHeight = bars[index1].style.height;
  bars[index1].style.height = bars[index2].style.height;
  bars[index2].style.height = tempHeight;
}

function updateBarHeight(index, height) {
  const bars = document.querySelectorAll('.bar');
  bars[index].style.height = `${height}px`;
}
