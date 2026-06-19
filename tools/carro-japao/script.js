// =========================
// ANO ATUAL
// =========================

const ANO = new Date().getFullYear();


// =========================
// HISTÓRICO
// =========================

let historico = JSON.parse(
localStorage.getItem("carro-japao-historico")
) || [];

atualizarHistorico();


// =========================
// TABELA 普通自動車
// (Futsū Jidōsha)
// Valores aproximados pós-2019
// =========================

const impostoNormal = [

{
limite:1000,
valor:25000
},

{
limite:1500,
valor:30500
},

{
limite:2000,
valor:36000
},

{
limite:2500,
valor:43500
},

{
limite:3000,
valor:50000
},

{
limite:4000,
valor:65500
},

{
limite:99999,
valor:75500
}

];


// =========================
// 軽自動車 (Kei Jidōsha)
// =========================

const impostoKei = {

novo:10800,
antigo:12900

};


// =========================
// PROCURAR FAIXA
// =========================

function buscarImpostoNormal(cilindrada){

    for(const item of impostoNormal){

        if(cilindrada <= item.limite){

            return item.valor;

        }

    }

    return 0;

}


// =========================
// FORMATAR IENE
// =========================

function formatarYen(valor){

    return "¥" +

    valor.toLocaleString(
    "ja-JP"
    );

}


// =========================
// SALVAR HISTÓRICO
// =========================

function salvarHistorico(texto){

    historico.unshift(texto);

    if(historico.length > 10){

        historico.pop();

    }

    localStorage.setItem(

    "carro-japao-historico",

    JSON.stringify(historico)

    );

    atualizarHistorico();

}


// =========================
// ATUALIZAR HISTÓRICO
// =========================

function atualizarHistorico(){

    const lista =
    document.getElementById(
    "historico"
    );

    if(historico.length === 0){

        lista.innerHTML =
        "<li>Nenhum cálculo realizado</li>";

        return;

    }

    lista.innerHTML = historico.map(item => `

<li>${item}</li>

`).join("");

}

// =========================
// BOTÃO CALCULAR
// =========================

document
.querySelector(".btn-calcular")
.addEventListener(
"click",
calcularImposto
);


// =========================
// CÁLCULO DO 自動車税
// (Jidōsha-zei)
// =========================

function calcularImposto(){

    const tipo =
    document
    .getElementById("tipo")
    .value;

    const cilindrada =
    Number(
    document
    .getElementById("cilindrada")
    .value
    );

    const registro =
    document
    .getElementById("registro")
    .value;

    const idade =
    document
    .getElementById("idade")
    .value;

    let imposto = 0;


    // =====================
    // 軽自動車
    // (Kei Jidōsha)
    // =====================

    if(tipo === "kei"){

        imposto =
        registro === "novo"

        ? impostoKei.novo

        : impostoKei.antigo;

    }


    // =====================
    // 普通自動車
    // (Futsū Jidōsha)
    // =====================

    else{

        imposto =
        buscarImpostoNormal(
        cilindrada
        );

        // veículos anteriores a outubro/2019

        if(registro === "antigo"){

            imposto =
            Math.round(
            imposto * 1.05
            );

        }

    }


    // =====================
    // MAIS DE 13 ANOS
    // =====================

    if(idade === "13"){

        imposto =
        Math.round(
        imposto * 1.15
        );

    }


    // =====================
    // VALOR MENSAL
    // =====================

    const mensal =
    Math.round(
    imposto / 12
    );


    // =====================
    // CATEGORIA
    // =====================

    let categoria = "";

    if(tipo === "kei"){

        categoria =
        "軽自動車 (Kei Jidōsha)";

    }

    else{

        categoria =
        cilindrada + " cc";

    }


    // =====================
    // RESULTADO
    // =====================

    document
    .getElementById(
    "resultadoImposto"
    )
    .innerHTML =

    `
${formatarYen(imposto)} por ano

<br><br>

≈ ${formatarYen(mensal)} por mês

<br><br>

${categoria}

<br><br>

Pagamento:
Maio
`;


    salvarHistorico(

    categoria +

    " → " +

    formatarYen(imposto)

    );



    calcularShaken();

}

// =========================
// 車検 (Shaken)
// =========================

function calcularShaken(){

    const dataUltimo =
    document
    .getElementById("shaken")
    .value;

    if(!dataUltimo){

        document
        .getElementById(
        "resultadoShaken"
        )
        .textContent =
        "Data não informada";

        return;

    }

    const ultimo =
    new Date(dataUltimo);

    const proximo =
    new Date(ultimo);

    // regra padrão para carros particulares
    proximo.setFullYear(
    proximo.getFullYear() + 2
    );

    const hoje = new Date();

    hoje.setHours(0,0,0,0);

    proximo.setHours(0,0,0,0);

    const dias =
    Math.ceil(

    (proximo - hoje)

    /

    (1000 * 60 * 60 * 24)

    );

    let textoDias = "";

    if(dias > 0){

        textoDias =
        "Faltam " +
        dias +
        " dias";

    }

    else if(dias === 0){

        textoDias =
        "Vence hoje";

    }

    else{

        textoDias =
        "⚠ Atrasado";

    }

    document
    .getElementById(
    "resultadoShaken"
    )
    .innerHTML =

    proximo.toLocaleDateString(
    "pt-BR"
    )

    +

    "<br><br>"

    +

    textoDias;

}


// =========================
// BOTÃO COPIAR
// =========================

document
.querySelector(".btn-copiar")
.addEventListener(
"click",
copiarResultado
);

function copiarResultado(){

    const imposto =
    document
    .getElementById(
    "resultadoImposto"
    )
    .innerText;

    const shaken =
    document
    .getElementById(
    "resultadoShaken"
    )
    .innerText;

    const texto =

`🚗 Carro no Japão

自動車税 (Jidōsha-zei)

${imposto}

車検 (Shaken)

${shaken}`;

    navigator.clipboard
    .writeText(texto);

    const botao =
    document.querySelector(
    ".btn-copiar"
    );

    const original =
    botao.textContent;

    botao.textContent =
    "✓ Copiado";

    setTimeout(()=>{

        botao.textContent =
        original;

    },1500);

}


// =========================
// INICIALIZAÇÃO
// =========================

atualizarHistorico();
