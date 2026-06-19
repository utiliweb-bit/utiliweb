const ANO = new Date().getFullYear();

document.getElementById("anoAtual").textContent = ANO;


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
// SEGUNDA SEGUNDA-FEIRA
// =========================

function segundaSegundaFeira(mes){

    const data =
    new Date(ANO, mes-1, 1);

    while(data.getDay() !== 1){

        data.setDate(
        data.getDate()+1
        );

    }

    data.setDate(
    data.getDate()+7
    );

    return formatarISO(data);

}


// =========================
// TERCEIRA SEGUNDA-FEIRA
// =========================

function terceiraSegundaFeira(mes){

    const data =
    new Date(ANO, mes-1, 1);

    while(data.getDay() !== 1){

        data.setDate(
        data.getDate()+1
        );

    }

    data.setDate(
    data.getDate()+14
    );

    return formatarISO(data);

}


// =========================
// EQUINÓCIO DA PRIMAVERA
// 春分の日 (Shunbun no Hi)
// =========================

function equinocioPrimavera(){

    const dia =
    Math.floor(
    20.8431 +
    0.242194 *
    (ANO - 1980)
    -
    Math.floor(
    (ANO - 1980)/4
    )
    );

    return `${ANO}-03-${String(dia).padStart(2,"0")}`;

}


// =========================
// EQUINÓCIO DO OUTONO
// 秋分の日 (Shūbun no Hi)
// =========================

function equinocioOutono(){

    const dia =
    Math.floor(
    23.2488 +
    0.242194 *
    (ANO - 1980)
    -
    Math.floor(
    (ANO - 1980)/4
    )
    );

    return `${ANO}-09-${String(dia).padStart(2,"0")}`;

}


// =========================
// DIA DA SEMANA EM JAPONÊS
// =========================

const diasJP = [

"日曜日",
"月曜日",
"火曜日",
"水曜日",
"木曜日",
"金曜日",
"土曜日"

];


// =========================
// FORMATAR DATA
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

    diasJP[d.getDay()];

}

// =========================
// FERIADOS OFICIAIS
// =========================

let feriados = [

{
jp:"元日",
romaji:"Ganjitsu",
pt:"Ano Novo",
data:`${ANO}-01-01`
},

{
jp:"成人の日",
romaji:"Seijin no Hi",
pt:"Dia da Maioridade",
data:segundaSegundaFeira(1)
},

{
jp:"建国記念の日",
romaji:"Kenkoku Kinen no Hi",
pt:"Dia da Fundação Nacional",
data:`${ANO}-02-11`
},

{
jp:"天皇誕生日",
romaji:"Tennō Tanjōbi",
pt:"Aniversário do Imperador",
data:`${ANO}-02-23`
},

{
jp:"春分の日",
romaji:"Shunbun no Hi",
pt:"Equinócio da Primavera",
data:equinocioPrimavera()
},

{
jp:"昭和の日",
romaji:"Shōwa no Hi",
pt:"Dia de Showa",
data:`${ANO}-04-29`,
golden:true
},

{
jp:"憲法記念日",
romaji:"Kenpō Kinenbi",
pt:"Dia da Constituição",
data:`${ANO}-05-03`,
golden:true
},

{
jp:"みどりの日",
romaji:"Midori no Hi",
pt:"Dia do Verde",
data:`${ANO}-05-04`,
golden:true
},

{
jp:"こどもの日",
romaji:"Kodomo no Hi",
pt:"Dia das Crianças",
data:`${ANO}-05-05`,
golden:true
},

{
jp:"海の日",
romaji:"Umi no Hi",
pt:"Dia do Mar",
data:terceiraSegundaFeira(7)
},

{
jp:"山の日",
romaji:"Yama no Hi",
pt:"Dia da Montanha",
data:`${ANO}-08-11`
},

{
jp:"敬老の日",
romaji:"Keirō no Hi",
pt:"Dia do Respeito aos Idosos",
data:terceiraSegundaFeira(9)
},

{
jp:"秋分の日",
romaji:"Shūbun no Hi",
pt:"Equinócio de Outono",
data:equinocioOutono()
},

{
jp:"スポーツの日",
romaji:"Supōtsu no Hi",
pt:"Dia do Esporte",
data:segundaSegundaFeira(10)
},

{
jp:"文化の日",
romaji:"Bunka no Hi",
pt:"Dia da Cultura",
data:`${ANO}-11-03`
},

{
jp:"勤労感謝の日",
romaji:"Kinrō Kansha no Hi",
pt:"Dia de Ação de Graças pelo Trabalho",
data:`${ANO}-11-23`
}

];


// =========================
// ORDENAR POR DATA
// =========================

feriados.sort(
(a,b)=>
new Date(a.data)-new Date(b.data)
);


// =========================
// EXISTE DATA?
// =========================

function existeData(data){

    return feriados.some(
    item => item.data === data
    );

}


// =========================
// ADICIONAR FERIADO
// =========================

function adicionarFeriado(obj){

    if(!existeData(obj.data)){

        feriados.push(obj);

    }

}

// =========================
// 振替休日 (Furikae Kyūjitsu)
// Feriado substituto
// =========================

for(const item of [...feriados]){

    const data =
    new Date(item.data);

    if(data.getDay() === 0){

        data.setDate(
        data.getDate()+1
        );

        while(
        existeData(
        formatarISO(data)
        )){

            data.setDate(
            data.getDate()+1
            );

        }

        adicionarFeriado({

            jp:"振替休日",
            romaji:"Furikae Kyūjitsu",
            pt:"Feriado Substituto",
            data:formatarISO(data),
            furikae:true

        });

    }

}


// =========================
// 国民の休日 (Kokumin no Kyūjitsu)
// Dia entre dois feriados
// =========================

feriados.sort(
(a,b)=>
new Date(a.data)-new Date(b.data)
);

for(let i=0;i<feriados.length-1;i++){

    const atual =
    new Date(feriados[i].data);

    const proximo =
    new Date(feriados[i+1].data);

    const diferenca =
    (proximo-atual)
    /(1000*60*60*24);

    if(diferenca === 2){

        const meio =
        new Date(atual);

        meio.setDate(
        meio.getDate()+1
        );

        adicionarFeriado({

            jp:"国民の休日",
            romaji:"Kokumin no Kyūjitsu",
            pt:"Feriado Nacional Especial",
            data:formatarISO(meio),
            kokumin:true

        });

    }

}

feriados.sort(
(a,b)=>
new Date(a.data)-new Date(b.data)
);


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

<div class="nome-jp">

${item.jp}
(${item.romaji})

</div>

<div class="nome-pt">

${item.pt}

</div>

<div class="data">

${formatarData(item.data)}

</div>

<div class="badges">

${item.golden ?
`<span class="badge-golden">
⭐ Golden Week
</span>`
: ""}

${item.furikae ?
`<span class="badge-furikae">
振替休日
</span>`
: ""}

${item.kokumin ?
`<span class="badge-kokumin">
国民の休日
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

        item.jp.includes(texto)

        ||

        item.romaji.toLowerCase()
        .includes(texto)

        ||

        item.pt.toLowerCase()
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
    // mostra o Ano Novo do próximo ano

    if(!proximo){

        const proximoAno =
        ANO + 1;

        proximo = {

            jp:"元日",
            romaji:"Ganjitsu",
            pt:"Ano Novo",
            data:`${proximoAno}-01-01`

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

    `${proximo.jp}
(${proximo.romaji})`;

    document
    .getElementById("proximoData")
    .textContent =

    `${proximo.pt} • ${formatarData(proximo.data)}`;

    document
    .getElementById("diasRestantes")
    .textContent =

    diferenca === 0
    ? "Hoje"
    : `${diferenca} dias`;

}


// =========================
// INICIALIZAÇÃO
// =========================

mostrarFeriados(feriados);

mostrarProximoFeriado();
