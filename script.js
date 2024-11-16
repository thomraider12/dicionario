const inputEl = document.getElementById("input");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const meaningEl = document.getElementById("meaning");
const audioEl = document.getElementById("audio");

// Função para buscar os dados da API
async function fetchAPI(word) {
  try {
    infoTextEl.style.display = "block";
    meaningContainerEl.style.display = "none";
    infoTextEl.innerText = `Procurando o significado de "${word}"...`;

    const url = `https://api.dicionario-aberto.net/word/${word}`;
    const result = await fetch(url).then((res) => res.json());

    if (result.length === 0) {
      // Caso a palavra não seja encontrada
      meaningContainerEl.style.display = "block";
      infoTextEl.style.display = "none";
      titleEl.innerText = word;
      meaningEl.innerText = "Significado não encontrado.";
      audioEl.style.display = "none";
    } else {
      // Palavra encontrada
      const definitionMatch = result[0].xml.match(/<def>([\s\S]*?)<\/def>/);
      const definition = definitionMatch ? definitionMatch[1].trim() : "Definição não disponível.";

      // Remover parênteses, se existirem
      const cleanDefinition = definition.startsWith("(") && definition.endsWith(")")
        ? definition.slice(1, -1)
        : definition;

      infoTextEl.style.display = "none";
      meaningContainerEl.style.display = "block";
      titleEl.innerText = word;
      meaningEl.innerText = cleanDefinition;
      audioEl.style.display = "none"; // Sem áudio na API do Dicionário Aberto

      // Reproduzir TTS
      speakWord(word);
    }
  } catch (error) {
    console.log(error);
    infoTextEl.innerText = `Ocorreu um erro. Tente novamente mais tarde.`;
  }
}

// Função para Text-to-Speech
function speakWord(word) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "pt-PT"; // Define o idioma como português de Portugal
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech Synthesis não é suportado neste navegador.");
  }
}

// Adicionar evento ao campo de entrada
inputEl.addEventListener("keyup", (e) => {
  if (e.target.value && e.key === "Enter") {
    fetchAPI(e.target.value);
  }
});
