document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start_scraping' }, (response) => {
        document.getElementById('status').textContent = 'Processo iniciado...';
    });
});
