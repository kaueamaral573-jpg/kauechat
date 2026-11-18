
const areaMensagens = document.getElementById("mensagens");
const textoVazio    = document.getElementById("vazio");
const form          = document.getElementById("form");
const campo         = document.getElementById("campo");
const btnEnviar     = document.getElementById("btn-enviar");
const btnNova       = document.getElementById("btn-nova");


const PROMPT_SISTEMA = {
  role: "system",
  content: "Você é um assistente prestativo. Responda em português do Brasil, de forma clara e objetiva."
};

let historico = [PROMPT_SISTEMA];

let aguardando = false;


function adicionarBalao(texto, tipo) {
  textoVazio.hidden = true;

  const balao = document.createElement("div");
  balao.className = `balao ${tipo}`;
  balao.textContent = texto; 

  areaMensagens.appendChild(balao);
  rolarParaFim();
  return balao;
}

function mostrarCarregando() {
  const balao = document.createElement("div");
  balao.className = "balao ia carregando";
  balao.innerHTML = "<span></span><span></span><span></span>";
  areaMensagens.appendChild(balao);
  rolarParaFim();
  return balao; 
}

function rolarParaFim() {
  areaMensagens.scrollTop = areaMensagens.scrollHeight;
}

function definirAguardando(valor) {
  aguardando = valor;
  campo.disabled = valor;
  btnEnviar.disabled = valor;
  if (!valor) campo.focus();
}

function ajustarAltura() {
  campo.style.height = "auto";
  campo.style.height = campo.scrollHeight + "px";
}


async function chamarApi(mensagens) {
  const chave = API_KEY.trim();

  if (!chave || chave === "COLE_SUA_CHAVE_AQUI") {
    throw new Error("Você ainda não colocou sua chave de API no arquivo config.js.");
  }
  if (API_URL.includes("groq.com") && !chave.startsWith("gsk_")) {
    throw new Error("Essa chave não parece ser da Groq (ela deve começar com gsk_). Gere uma em console.groq.com/keys.");
  }

  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${chave}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: mensagens
    })
  });

  if (!resposta.ok) {
    let detalhe = "";
    try {
      const corpo = await resposta.json();
      detalhe = corpo.error?.message || "";
    } catch (e) {
    }
    const base = descreverErroHttp(resposta.status);
    throw new Error(detalhe ? `${base}\nDetalhe da API: ${detalhe}` : base);
  }

  const dados = await resposta.json();
  const texto = dados.choices?.[0]?.message?.content;

  if (!texto) {
    throw new Error("A API respondeu em um formato inesperado.");
  }
  return texto;
}

function descreverErroHttp(status) {
  if (status === 401) return "Chave de API inválida. Confira o arquivo config.js.";
  if (status === 404) return "Modelo ou endereço da API não encontrado. Confira o config.js.";
  if (status === 429) return "Limite de requisições atingido. Aguarde um pouco e tente de novo.";
  if (status >= 500)  return "O servidor da API está com problemas. Tente novamente em instantes.";
  return `Erro na comunicação com a API (código ${status}).`;
}

async function enviarMensagem(texto) {
  adicionarBalao(texto, "usuario");
  historico.push({ role: "user", content: texto });

  definirAguardando(true);
  const indicador = mostrarCarregando();

  try {
    const respostaIA = await chamarApi(historico);

    historico.push({ role: "assistant", content: respostaIA });
    indicador.remove();
    adicionarBalao(respostaIA, "ia");

  } catch (erro) {
    console.error("Erro:", erro);

    historico.pop();
    indicador.remove();

    const mensagemErro = erro instanceof TypeError
      ? "Não foi possível conectar. Verifique sua internet e tente de novo."
      : erro.message;

    adicionarBalao(mensagemErro, "erro");

  } finally {
    definirAguardando(false);
  }
}


form.addEventListener("submit", (evento) => {
  evento.preventDefault(); 

  const texto = campo.value.trim();
  if (!texto || aguardando) return;

  campo.value = "";
  ajustarAltura();
  enviarMensagem(texto);
});

campo.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" && !evento.shiftKey) {
    evento.preventDefault();
    form.requestSubmit();
  }
});

campo.addEventListener("input", ajustarAltura);

btnNova.addEventListener("click", () => {
  historico = [PROMPT_SISTEMA];
  areaMensagens.querySelectorAll(".balao").forEach((el) => el.remove());
  textoVazio.hidden = false;
  campo.value = "";
  ajustarAltura();
  campo.focus();
});