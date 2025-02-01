window.addEventListener("load", function() {
  try {
    const extractedContent = document.evaluate(
      '/html/body/div/div[2]/section[1]/div[2]/div[2]/div[1]/div/div[2]/div', 
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;

    if (extractedContent) {
      const contentText = extractedContent.innerText;
      chrome.runtime.sendMessage({ action: "sendContent", content: contentText });
    } else {
      throw new Error("Conteúdo não encontrado.");
    }
  } catch (error) {
    chrome.runtime.sendMessage({ action: "sendContent", content: error.message });
  }
});
