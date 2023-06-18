const websiteList = document.getElementById('website-list');
const paginationContainer = document.getElementById('pagination');
const pageInput = document.getElementById('page-number');
const goButton = document.getElementById('go-button');

let websites = [];
let currentPage = 1;
const chunkSize = 1000;
let totalPages = 0;

function loadWebsites() {
  const startIndex = (currentPage - 1) * chunkSize;
  const endIndex = Math.min(startIndex + chunkSize, websites.length);
  websiteList.innerHTML = '';

  for (let i = startIndex; i < endIndex; i++) {
    const website = websites[i];
    const li = document.createElement('li');
    const a = document.createElement('a');
    const img = document.createElement('img');

    a.href = website;
    a.target = '_blank';
    a.textContent = website;

    img.src = `https://www.google.com/s2/favicons?sz=48&domain_url=${website}`;
    img.alt = website;
    img.loading = 'lazy';

    a.prepend(img);
    li.appendChild(a);
    websiteList.appendChild(li);
  }
}

function updatePagination() {
  paginationContainer.innerHTML = '';

  if (currentPage > 1) {
    const prevButton = createPaginationButton('Prev');
    prevButton.addEventListener('click', () => {
      currentPage--;
      loadWebsites();
      updatePagination();
    });
    paginationContainer.appendChild(prevButton);
  }

  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  let startPage = currentPage - halfVisiblePages;
  let endPage = currentPage + halfVisiblePages;

  if (startPage <= 0) {
    endPage += Math.abs(startPage) + 1;
    startPage = 1;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLink = createPaginationButton(i);
    if (i === currentPage) {
      pageLink.classList.add('active');
    }
    pageLink.addEventListener('click', () => {
      currentPage = i;
      loadWebsites();
      updatePagination();
    });
    paginationContainer.appendChild(pageLink);
  }

  if (currentPage < totalPages) {
    const nextButton = createPaginationButton('Next');
    nextButton.addEventListener('click', () => {
      currentPage++;
      loadWebsites();
      updatePagination();
    });
    paginationContainer.appendChild(nextButton);
  }

  const lastPageLink = createPaginationButton(totalPages);
  lastPageLink.addEventListener('click', () => {
    currentPage = totalPages;
    loadWebsites();
    updatePagination();
  });
  paginationContainer.appendChild(lastPageLink);
}

function createPaginationButton(label) {
  const button = document.createElement('a');
  button.href = '#';
  button.textContent = label;
  return button;
}

function goToPage() {
  const pageNumber = parseInt(pageInput.value);

  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    loadWebsites();
    updatePagination();
  }
}

function initializePagination() {
  totalPages = Math.ceil(websites.length / chunkSize);
  currentPage = 1;
  updatePagination();
}

fetch('websites.txt')
  .then(response => response.text())
  .then(text => text.trim().split('\n'))
  .then(data => {
    websites = data;
    initializePagination();
    loadWebsites();
  });

goButton.addEventListener('click', goToPage);
