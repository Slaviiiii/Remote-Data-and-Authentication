function attachEvents() { 
   document.getElementById('submit').addEventListener('click', createMsg);
   document.getElementById('refresh').addEventListener('click', refresh);
}

function createMsg() {
    let author = document.querySelector('input[name="author"]');
    let message = document.querySelector('input[name="content"]');

    let body = {
        author: author.value,
        content: message.value,
      }

      author.value = '';
      message.value = '';
      renderMsg(body);
}

function renderMsg(body) {
    let url = 'http://localhost:3030/jsonstore/messenger';
    let data = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return data;
}

async function refresh() {
    let textArea = document.getElementById('messages');
    let url = 'http://localhost:3030/jsonstore/messenger';
    let response = await fetch(url);
    let data = await response.json();
    let messages = [];
    Object.values(data).forEach(m => {
        let author = m.author;
        let message = m.content;
        messages.push(`${author}: ${message}`);
    });
    textArea.textContent = messages.join('\n');
}


attachEvents();