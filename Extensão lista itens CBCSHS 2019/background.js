// Função para inicializar o IndexedDB e criar o object store 'pages'
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("ScrapedDataDB", 1);

        request.onupgradeneeded = function(event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("pages")) {
                db.createObjectStore("pages", { keyPath: "link_pagina" });
                console.log("Object store 'pages' criado.");
            }
        };

        request.onsuccess = function(event) {
            let db = event.target.result;
            console.log("IndexedDB aberto com sucesso");
            resolve(db);
        };

        request.onerror = function(event) {
            console.error("Erro ao abrir o IndexedDB", event);
            reject(event);
        };
    });
}

// Função para salvar os dados no IndexedDB
function saveToIndexedDB(db, link_pagina, html) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["pages"], "readwrite");
        let objectStore = transaction.objectStore("pages");

        let request = objectStore.add({ link_pagina: link_pagina, html: html });

        request.onsuccess = () => {
            console.log(`Dados da página ${link_pagina} salvos no IndexedDB.`);
            resolve();
        };

        request.onerror = (event) => {
            console.error("Erro ao salvar dados no IndexedDB", event);
            reject(event);
        };
    });
}

// Função para verificar se o DOM está completamente carregado
function waitForPageLoad(tabId) {
    return new Promise((resolve) => {
        const checkDOMLoaded = setInterval(() => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => document.readyState
            }, (results) => {
                if (results && results[0] && results[0].result === 'complete') {
                    clearInterval(checkDOMLoaded);
                    resolve();
                }
            });
        }, 1000);
    });
}

// Função para processar os links
function processLinks(db, links, index = 0) {
    const linkValues = Object.values(links);  // Pegar os valores das URLs
    if (index >= linkValues.length) {
        console.log("Processo concluído.");
        return;
    }

    let link_pagina = linkValues[index];  // Pegar o link atual

    // Verifica se o link é válido antes de abrir a aba
    if (!link_pagina || typeof link_pagina !== 'string') {
        console.error(`Link inválido na posição ${index}. Pulando para o próximo.`);
        processLinks(db, links, index + 1);
        return;
    }

    chrome.tabs.create({ url: link_pagina, active: false }, function(tab) {
        // Esperar o carregamento completo da página
        waitForPageLoad(tab.id).then(() => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.querySelector("html").outerHTML  // Pegar o HTML inteiro
            }, (results) => {
                if (chrome.runtime.lastError || !results || !results[0]) {
                    console.error(`Erro ao acessar o conteúdo da página na posição ${index}. Pulando para o próximo.`);
                    chrome.tabs.remove(tab.id, function() {
                        setTimeout(() => processLinks(db, links, index + 1), 2000);
                    });
                    return;
                }

                let html = results[0].result;

                // Salvar no IndexedDB
                saveToIndexedDB(db, link_pagina, html).then(() => {
                    // Fechar a aba e continuar
                    chrome.tabs.remove(tab.id, function() {
                        setTimeout(() => processLinks(db, links, index + 1), 2000); // Espera 2 segundos para o próximo
                    });
                });
            });
        });
    });
}

// Iniciar a leitura do JSON e processamento dos links
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start_scraping') {
        fetch(chrome.runtime.getURL("links_trabalhos_CBCSHS_2019.json"))
            .then(response => response.json())
            .then(data => {
                if (typeof data === 'object') {
                    initIndexedDB().then((db) => {
                        processLinks(db, data.link_pagina);  // Acessar a chave correta
                    });
                } else {
                    console.error("O JSON não contém um objeto. Verifique o formato do arquivo.");
                }
            })
            .catch(err => {
                console.error("Erro ao carregar o arquivo JSON:", err);
            });
        sendResponse({ status: 'Processo iniciado' });
    }
});
