let currentIndex = 0;
let isRunning = false;
let db;
let caminho_json = 'trabalhos_sem_resumo_CBCSHS_2019.json'; // Nome do JSON de CBCSHS 2019

// Função de delay para aguardar 1 segundo
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Inicializa o IndexedDB com `link_resumo` como chave primária
function initDB() {
  const request = indexedDB.open('ExtratorResumosCBCSHSDB', 1);
  
  request.onerror = (event) => {
    console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
  };
  
  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB initialized');
  };
  
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore('resumos', { keyPath: 'link_resumo' });
    console.log('Object store "resumos" criada no IndexedDB');
  };
}

// Função para salvar um resumo no IndexedDB
function saveResumo(link_resumo, resumo) {
  const transaction = db.transaction(['resumos'], 'readwrite');
  const objectStore = transaction.objectStore('resumos');
  const request = objectStore.put({ link_resumo, resumo });
  
  request.onsuccess = () => {
    console.log(`Resumo do link ${link_resumo} salvo com sucesso.`);
  };
  
  request.onerror = (event) => {
    console.error('Erro ao salvar resumo:', event.target.errorCode);
  };
}

// Carrega o JSON de dados
function loadJsonData(callback) {
  fetch(chrome.runtime.getURL(caminho_json))
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.get(['lastIndex'], function(result) {
        if (result.lastIndex !== undefined) {
          currentIndex = result.lastIndex;
        } else {
          currentIndex = 0;
        }
        callback(data);
      });
    });
}

// Itera pelos links e atualiza o campo "abstract"
async function iterateLinks(jsonData) {
  try {
    const links = jsonData.link_resumo;
    const keys = Object.keys(links);

    if (!isRunning || currentIndex >= keys.length) {
      if (currentIndex >= keys.length) {
        console.log("Process completed.");
        chrome.runtime.sendMessage({ command: 'completed' });
      }
      return;
    }

    const link = links[keys[currentIndex]];
    if (!link) {
      throw new Error(`No link found at index ${currentIndex}`);
    }

    console.log(`Opening link at index ${currentIndex}: ${link}`);
    await delay(1000);

    chrome.tabs.create({ url: link, active: false }, function(tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const xpath = "/html/body/div/div[2]/section[1]/div[2]/div[2]/div[1]/div/div[2]/div";
          const abstractElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          return abstractElement ? abstractElement.innerText : null;
        }
      }, function(results) {
        if (results && results[0] && results[0].result) {
          saveResumo(link, results[0].result);
          console.log(`Resumo para o link ${link} atualizado para: ${results[0].result}`);
          
          currentIndex++;
          chrome.storage.local.set({ lastIndex: currentIndex });
          chrome.tabs.remove(tab.id, function() {
            iterateLinks(jsonData);
          });
        } else {
          throw new Error(`Failed to retrieve abstract for link ${link}`);
        }
      });
    });
  } catch (error) {
    console.error(`Error in iteration: ${error.message}`);
    isRunning = false;
    await delay(5000);
    console.log("Restarting process...");
    isRunning = true;
    iterateLinks(jsonData);
  }
}

// Listener para mensagens do popup.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === 'start') {
    console.log("Starting process...");
    isRunning = true;
    loadJsonData(iterateLinks);
    sendResponse({ status: 'started' });
  } else if (message.command === 'stop') {
    console.log("Stopping process...");
    isRunning = false;
    sendResponse({ status: 'stopped' });
  } else if (message.command === 'reset') {
    console.log("Resetting process...");
    currentIndex = 0;
    isRunning = false;
    chrome.storage.local.clear();
    sendResponse({ status: 'reset' });
  } else if (message.command === 'completed') {
    console.log("Process completed");
    sendResponse({ status: 'completed' });
  }
});

// Inicializa o IndexedDB ao carregar o script
initDB();
