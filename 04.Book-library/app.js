function attachEvents() {
  document.getElementById('loadBooks').addEventListener('click', onLoad);
  let btns = document.querySelectorAll('button');
  btns[btns.length - 1].addEventListener('click', onSubmit);
}

async function onLoad() {
    let url = 'http://localhost:3030/jsonstore/collections/books';
    let response = await fetch(url);
    let data = await response.json();
    let keys = Object.keys(data);
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    for (let i = 0; i < keys.length; i++) {
      let currentId = keys[i];
      let currentData = Object.values(data);
      let dataObj = currentData[i];
      if(dataObj === null) {
        continue;
      }
      let tr = document.createElement('tr');
      tr.setAttribute('data-id', currentId);
      let titleTd = document.createElement('td');
      let authorTd = document.createElement('td');
      let actionTd = document.createElement('td');
      
      titleTd.textContent = dataObj.title;
      authorTd.textContent = dataObj.author;
      let editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', (e) => {
        tr.remove();
        onEdit(e, titleTd.textContent, authorTd.textContent, currentId);
      });
      actionTd.appendChild(editBtn);

      let deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', (e) => {
        onDelete(e, currentId, tr);
      });
      actionTd.appendChild(deleteBtn);

      tr.appendChild(titleTd);
      tr.appendChild(authorTd);
      tr.appendChild(actionTd);

      tbody.appendChild(tr);
  }
}
async function onSubmit(e) {
  e.preventDefault();
  let title = document.querySelector('input[name="title"]');
  let author = document.querySelector('input[name="author"]');

  if (title.value == '' || author.value == '') {
    return;
  }

  let body = {
    title: title.value,
    author: author.value
  }

  title.value = '';
  author.value = '';

  let url = 'http://localhost:3030/jsonstore/collections/books';
  const headers = getHeader('POST', body);
  let data = await fetch(url, headers);
  return data;
}

async function onEdit(e, titleT, authorT, id) {
  e.preventDefault();
  let title = document.querySelector('input[name="title"]');
  let author = document.querySelector('input[name="author"]');

  title.value = titleT;
  author.value = authorT;

  let btns = document.querySelectorAll('button');
  let submitBtn = btns[btns.length - 1];
  submitBtn.textContent = 'Save';

  let h3 = document.querySelector('h3');
  h3.textContent = `Edit FORM`;

  let body = {
    "author": `${author.value}`,
    "title": `${title.value}` 
  }

  let url = `http://localhost:3030/jsonstore/collections/books/${id}`;
  const headers = getHeader('PUT', body);
  let response = await fetch(url, headers); 
}

async function onDelete(e, id, parent) {
  e.preventDefault();
  let url = `http://localhost:3030/jsonstore/collections/books/${id}`;
  const headers = getHeader('DELETE', null);
  let response = await fetch(url, headers);
  let data = await response.json();
  parent.remove();
  return data;
}

function getHeader(method, body) {
  return {
    method: `${method}`,
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

attachEvents();