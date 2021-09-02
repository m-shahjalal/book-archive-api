const root = document.getElementById('element');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const loadData = () => {
	const query = document.getElementById('search').value;
	if (query) {
		root.textContent = '';
		return addSpinner(`https://openlibrary.org/search.json?q=${query}`);
	} else {
		return emptyMessage();
	}
};

const emptyMessage = () => {
	if (document.getElementById('empty-message')) return;
	const warning = document.createElement('small');

	warning.classList.add('p-1', 'text-danger');
	warning.id = 'empty-message';
	warning.innerText = 'please type something';
	document.getElementById('search-box').appendChild(warning);
};

const addSpinner = async (url) => {
	const error = document.getElementById('empty-message');
	if (error) document.getElementById('search-box').removeChild(error);

	const initialText = document.getElementById('initial-text');
	if (initialText) root.removeChild(initialText);

	if (document.getElementById('spinner')) return;
	searchBtn.disabled = true;
	const spinner = document.createElement('div');
	spinner.classList.add('d-flex', 'justify-content-center', 'mt-5');
	spinner.id = 'spinner';
	spinner.innerHTML = `
        <div class="spinner-border text-success" role="status">
            <span class="sr-only"></span>
        </div>
    `;
	root.appendChild(spinner);
	generateList(url);
};

const generateList = async (url) => {
	const response = await fetch(url);
	const data = await response.json();
	const row = document.createElement('div');
	const result = document.createElement('p');
	const notFound = document.createElement('h3');

	console.log(data);
	root.removeChild(document.getElementById('spinner'));
	row.classList.add('row', 'h-100');
	result.classList.add('w-100', 'text-center');
	notFound.classList.add('text-center', 'text-muted', 'mt-5', 'py-5');
	notFound.innerHTML = `there is no book with <b>${data.q}</b>`;

	if (data.numFound) {
		result.innerText = `Total result found ${data.numFound}`;
		root.appendChild(result);
		data.docs.forEach((item) => single(item, row));
	} else {
		root.textContent = '';
		root.appendChild(notFound);
	}
	searchBtn.disabled = false;
};

const single = (item, row) => {
	const title = item.title;
	const publish = (item.publish_date && item.publish_date[0]) || 'Unknown';
	const first = item.first_publish_year || 'Unknown';
	const publisher = (item.publisher && item.publisher[0]) || 'Unknown';
	const author = item.author_name
		? item.author_name[0] || item.author_name
		: 'Unknown';
	const url = item.cover_i
		? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
		: './cover.jpeg';

	const column = document.createElement('div');
	column.classList.add('col', 'col-md-6', 'col-lg-4', 'p-3');
	column.innerHTML = `
            <div class="card h-100 d-flex bg-white border shadow-sm flex-column justify-content-stretch rounded-3">
                <img class="img-fluid rounded-top rounded-top-3" style="height:360px"
				src="${url}" alt="${title}" />
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
					<div  class="card-text mt-2">
						<p>Author: ${author}</p>
						<p>First publish: ${first}</p>
						<p>Publish: ${publish}</p>
						<p>Publisher: ${publisher}</p>
					</div>
                </div>
            </div>
        `;
	row.appendChild(column);
	root.appendChild(row);
};
