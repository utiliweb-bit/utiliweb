const ANO = new Date().getFullYear();

document.getElementById("anoAtual").textContent = ANO;


// =========================
// DIAS DA SEMANA
// =========================

const diasSemana = [

"domingo",
"segunda-feira",
"terça-feira",
"quarta-feira",
"quinta-feira",
"sexta-feira",
"sábado"

];


// =========================
// FORMATAR DATA ISO
// =========================

function formatarISO(data){

    const ano = data.getFullYear();

    const mes =
    String(data.getMonth()+1)
    .padStart(2,"0");

    const dia =
    String(data.getDate())
    .padStart(2,"0");

    return `${ano}-${mes}-${dia}`;

}


// =========================
// FORMATAR DATA PT-BR
// =========================

function formatarData(data){

    const d = new Date(data);

    return d.toLocaleDateString(
    "pt-BR",
    {
        day:"2-digit",
        month:"2-digit",
        year:"numeric"
    })

    + " • " +

    diasSemana[d.getDay()];

}


// =========================
// CALCULAR PÁSCOA
// (Algoritmo de Meeus)
// =========================

function calcularPascoa(ano){

    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const mes =
    Math.floor((h + l - 7 * m + 114) / 31);

    const dia =
    ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(ano, mes - 1, dia);

}


// =========================
// DATAS MÓVEIS
// =========================

const pascoa =
calcularPascoa(ANO);

const sextaSanta =
new Date(pascoa);

sextaSanta.setDate(
sextaSanta.getDate() - 2
);

const carnaval =
new Date(pascoa);

carnaval.setDate(
carnaval.getDate() - 47
);

const corpusChristi =
new Date(pascoa);

corpusChristi.setDate(
corpusChristi.getDate() + 60
);

// =========================
// FERIADOS NACIONAIS
// =========================

let feriados = [

{
nome:"Confraternização Universal",
data:`${ANO}-01-01`
},

{
nome:"Carnaval",
data:formatarISO(carnaval),
carnaval:true
},

{
nome:"Sexta-feira Santa",
data:formatarISO(sextaSanta),
pascoa:true
},

{
nome:"Páscoa",
data:formatarISO(pascoa),
pascoa:true
},

{
nome:"Tiradentes",
data:`${ANO}-04-21`
},

{
nome:"Dia do Trabalho",
data:`${ANO}-05-01`
},

{
nome:"Corpus Christi",
data:formatarISO(corpusChristi),
pascoa:true
},

{
nome:"Independência do Brasil",
data:`${ANO}-09-07`
},

{
nome:"Nossa Senhora Aparecida",
data:`${ANO}-10-12`
},

{
nome:"Finados",
data:`${ANO}-11-02`
},

{
nome:"Proclamação da República",
data:`${ANO}-11-15`
},

{
nome:"Dia da Consciência Negra",
data:`${ANO}-11-20`
},

{
nome:"Natal",
data:`${ANO}-12-25`,
natal:true
}

];


// =========================
// ORDENAR POR DATA
// =========================

feriados.sort(
(a,b)=>
new Date(a.data) -
new Date(b.data)
);


// =========================
// FERIADO PROLONGADO
// =========================

function ehProlongado(data){

    const diaSemana =
    new Date(data).getDay();

    // Sexta ou segunda

    return (
    diaSemana === 1 ||
    diaSemana === 5
    );

}


// =========================
// TOTAL DE FERIADOS
// =========================

document
.getElementById("totalFeriados")
.textContent =
feriados.length;

// =========================
// RENDERIZAR LISTA
// =========================

function mostrarFeriados(lista){

    const div =
    document.getElementById(
    "listaFeriados"
    );

    div.innerHTML =
    lista.map(item => `

<div class="card-feriado">

<div class="nome-feriado">

${item.nome}

</div>

<div class="data">

${formatarData(item.data)}

</div>

<div class="badges">

${item.carnaval ?

`<span class="badge-carnaval">
🎭 Carnaval
</span>`

: ""}


${item.pascoa ?

`<span class="badge-pascoa">
✝️ Semana Santa / Páscoa
</span>`

: ""}


${item.natal ?

`<span class="badge-natal">
🎄 Natal
</span>`

: ""}


${ehProlongado(item.data) ?

`<span class="badge-prolongado">
⭐ Feriado prolongado
</span>`

: ""}

</div>

</div>

`).join("");

}


// =========================
// PESQUISA
// =========================

document
.getElementById("busca")
.addEventListener(
"input",
pesquisar
);


function pesquisar(){

    const texto =
    document
    .getElementById("busca")
    .value
    .toLowerCase();

    const resultado =
    feriados.filter(item =>

        item.nome
        .toLowerCase()
        .includes(texto)

    );

    mostrarFeriados(resultado);

}

// =========================
// PRÓXIMO FERIADO
// =========================

function mostrarProximoFeriado(){

    const hoje = new Date();

    hoje.setHours(0,0,0,0);

    let proximo = null;

    for(const item of feriados){

        const data =
        new Date(item.data);

        data.setHours(0,0,0,0);

        if(data >= hoje){

            proximo = item;
            break;

        }

    }

    // Se todos os feriados do ano já passaram,
    // mostra o primeiro do próximo ano

    if(!proximo){

        proximo = {

            nome:"Confraternização Universal",
            data:`${ANO + 1}-01-01`

        };

    }

    const dataFeriado =
    new Date(proximo.data);

    const diferenca =
    Math.ceil(

    (dataFeriado - hoje)

    / (1000 * 60 * 60 * 24)

    );

    document
    .getElementById("proximoNome")
    .textContent =
    proximo.nome;

    document
    .getElementById("proximoData")
    .textContent =
    formatarData(proximo.data);

    document
    .getElementById("diasRestantes")
    .textContent =

    diferenca === 0
    ? "Hoje"
    : `${diferenca} dias`;

}


// =========================
// PRÓXIMOS 3 FERIADOS
// =========================

function mostrarTop3(){

    const hoje = new Date();

    hoje.setHours(0,0,0,0);

    const proximos =
    feriados.filter(item => {

        const data =
        new Date(item.data);

        data.setHours(0,0,0,0);

        return data >= hoje;

    }).slice(0,3);

    document
    .getElementById("top3")
    .innerHTML =

    proximos.map(item =>

    `• ${item.nome}<br>`

    ).join("");

}


// =========================
// INICIALIZAÇÃO
// =========================

mostrarFeriados(feriados);

mostrarProximoFeriado();

mostrarTop3();
