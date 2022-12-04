function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', onLoad);
    document.getElementById('btnCreate').addEventListener('click', handleCreateRecord);
}

function handleCreateRecord() {
    const person = document.getElementById('person');
    const phone = document.getElementById('phone');
    createRecord(person.value, phone.value);
    person.value = '';
    phone.value = '';
}

function renderRecords(data) {
    let ul = document.getElementById('phonebook');
    ul.innerHTML = '';
    Object.values(data).forEach(rec => {
        const liElement = document.createElement('li');
        liElement.textContent = `${rec.person}: ${rec.phone}`;
        liElement.setAttribute('data-id', rec._id);
        const deletebtn = document.createElement('button');
        deletebtn.textContent = 'Delete';
        deletebtn.addEventListener('click', onDelete);
        liElement.appendChild(deletebtn);
        ul.appendChild(liElement);
    });

}

function onDelete(e) {
    const li = e.target.parentElement;
    const id = li.getAttribute('data-id');
    deleteRecord(id);
    li.remove();
}

async function onLoad() {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const reponse = await fetch(url);
    const data = await reponse.json();
    return renderRecords(data);   
}

async function createRecord(person, phone) {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const body = {
        person,
        phone
    }
    const header = getHeaders('POST', body);
    const response = await fetch(url, header);
    const data = await response.json();  
    let ul = document.getElementById('phonebook');
    if(ul.innerHTML !== '') {
        onLoad();
    }
    return data;
}

async function deleteRecord(id) {
    const url = `http://localhost:3030/jsonstore/phonebook/${id}`;
    const header = getHeaders('DELETE', null);
    const response = await fetch(url, header);
    const data = await response.json();
    return data;
}

function getHeaders(method, body) {
    return {
        method: `${method}`,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}

attachEvents(); 