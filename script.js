
// Abaixo há uma amostra DEMONSTRATIVA de qx (não oficial) para algumas idades. será posto

const demoEMSBR = {
  // idade: qx (valores ilustrativos!)
  18: 0.00040,
  20: 0.00042,
  25: 0.00046,
  30: 0.00055,
  35: 0.00065,
  40: 0.00085,
  45: 0.00120,
  50: 0.00200,
  55: 0.00350,
  60: 0.00600,
  65: 0.01000,
  70: 0.01800,
  75: 0.03000,
  80: 0.05000,
  85: 0.09000
};

// Estado atual da tábua carregada (inicia com a amostra)
let tabua = { ...demoEMSBR };

// Utilitário para formatar percentual
const pct = (x) => (x * 100).toFixed(3) + "%";

function calcular() {
  const idadeEl = document.getElementById("idade");
  const out = document.getElementById("resultado");
  const idade = parseInt(idadeEl.value, 10);

  if (Number.isNaN(idade)) {
    out.innerHTML = '<p class="muted">Informe uma idade válida.</p>';
    return;
  }

  if (tabua[idade] == null) {
    out.innerHTML = `
      <div class="line"><span><strong>Idade:</strong></span> <span>${idade}</span></div>
      <p class="muted">Idade não encontrada na tábua carregada.\nCarregue o CSV EMS‑BR (idade,qx) ou inclua este ponto na amostra.</p>
    `;
    return;
  }

  const qx = Number(tabua[idade]);
  const px = 1 - qx;

  out.innerHTML = `
    <div class="line"><span><strong>Idade consultada</strong></span><span>${idade}</span></div>
    <div class="line"><span><strong>q<sub>x</sub> (prob. de morte entre x e x+1)</strong></span><span>${pct(qx)}</span></div>
    <div class="line"><span><strong>p<sub>x</sub> = 1 − q<sub>x</sub> (prob. de sobrevivência)</strong></span><span>${pct(px)}</span></div>
  `;
}

// Carregar CSV EMS‑BR (idade,qx)
async function carregarCSV(event) {
  const file = event.target.files?.[0];
  const status = document.getElementById("csvStatus");
  if (!file) { status.textContent = "Nenhum arquivo selecionado."; return; }

  try {
    const text = await file.text();
    const linhas = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const novaTabua = {};

    for (const linha of linhas) {
      // aceita separador vírgula ou ponto-e-vírgula
      const parts = linha.split(/[;,]/).map(s => s.trim());
      if (parts.length < 2) continue;
      const idade = parseInt(parts[0], 10);
      const qx = Number(parts[1].replace(',', '.'));
      if (!Number.isNaN(idade) && Number.isFinite(qx)) {
        novaTabua[idade] = qx;
      }
    }

    const total = Object.keys(novaTabua).length;
    if (total === 0) {
      status.textContent = "CSV inválido ou vazio. Use o formato idade,qx";
      return;
    }

    tabua = novaTabua;
    status.textContent = `Tábua carregada com sucesso: ${total} idades.`;
  } catch (err) {
    console.error(err);
    status.textContent = "Falha ao ler o arquivo CSV.";
  }
}

// Ligações de evento
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCalcular').addEventListener('click', calcular);
  const csvInput = document.getElementById('csvInput');
  if (csvInput) csvInput.addEventListener('change', carregarCSV);
});
