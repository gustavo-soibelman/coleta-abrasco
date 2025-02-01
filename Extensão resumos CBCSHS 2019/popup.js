document.addEventListener('DOMContentLoaded', function() {
  const startStopBtn = document.getElementById('startStopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const headerText = document.getElementById('headerText');
  const spinner = document.getElementById('spinner');

  // Inicializa a interface gráfica
  chrome.storage.local.get(['lastIndex'], function(result) {
    if (result.lastIndex !== undefined) {
      headerText.innerText = "Último título aberto: " + result.lastIndex;
    } else {
      headerText.innerText = "Clique Start para começar";
    }
  });

  // Alterna entre start/stop
  startStopBtn.addEventListener('click', function() {
    chrome.storage.local.get(['isRunning'], function(result) {
      if (result.isRunning) {
        chrome.storage.local.set({ isRunning: false });
        startStopBtn.innerText = 'Start';
        spinner.style.display = 'none'; // Esconde o spinner
        chrome.runtime.sendMessage({ command: 'stop' });
      } else {
        chrome.storage.local.set({ isRunning: true });
        startStopBtn.innerText = 'Stop';
        spinner.style.display = 'block'; // Mostra o spinner
        chrome.runtime.sendMessage({ command: 'start' });
      }
    });
  });

  // Botão de reset
  resetBtn.addEventListener('click', function() {
    chrome.storage.local.clear(); // Limpa todas as variáveis
    headerText.innerText = "Clique Start para começar";
    startStopBtn.innerText = "Start";
    spinner.style.display = 'none'; // Esconde o spinner
    chrome.runtime.sendMessage({ command: 'reset' });
  });

  // Atualiza o texto do botão conforme o estado atual
  chrome.storage.local.get(['isRunning'], function(result) {
    if (result.isRunning) {
      startStopBtn.innerText = 'Stop';
      spinner.style.display = 'block'; // Mostra o spinner
    } else {
      startStopBtn.innerText = 'Start';
      spinner.style.display = 'none'; // Esconde o spinner
    }
  });
});
