const CATEGORIES = [
  { id: 'historia',    label: 'História',       icon: '🏛️', start: 0, end: 100 },
  { id: 'ciencias',    label: 'Ciências',       icon: '🔬', start: 100, end: 200 },
  { id: 'geografia',   label: 'Geografia',      icon: '🌍', start: 200, end: 300 },
  { id: 'cultura',     label: 'Cultura Geral',  icon: '🎭', start: 300, end: 400 },
  { id: 'esportes',    label: 'Esportes',       icon: '⚽', start: 400, end: 500 },
];

let selCat = null, selDiff = 'Todas', selQty = 10;
let quizQuestions = [], curQ = 0, score = 0, wrong = 0, answered = false;

// Inicialização
window.onload = () => {
    buildCategoryGrid();
    makePillRow('diff-row', v => { selDiff = v; });
    makePillRow('qty-row',  v => { selQty = parseInt(v); });
};

function buildCategoryGrid() {
    const catGrid = document.getElementById('cat-grid');
    if (!catGrid) return;
    
    catGrid.innerHTML = '';
    CATEGORIES.forEach(c => {
        const b = document.createElement('button');
        b.className = 'cat-btn';
        b.innerHTML = `<span class="cat-icon">${c.icon}</span>${c.label}`;
        b.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            selCat = c;
            document.getElementById('start-btn').disabled = false;
            document.getElementById('start-btn').textContent = "Começar Quiz de " + c.label;
        };
        catGrid.appendChild(b);
    });
}

function makePillRow(rowId, onchange) {
    const buttons = document.querySelectorAll(`#${rowId} .pill-btn`);
    buttons.forEach(b => {
        b.onclick = () => {
            document.querySelectorAll(`#${rowId} .pill-btn`).forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            onchange(b.dataset.v);
        };
    });
}

// Lógica de Início do Jogo
document.getElementById('start-btn').onclick = () => {
    if (!selCat) return;
    
    // 1. Pegar perguntas do arquivo questions.js (variável global 'questions')
    if (typeof questions === 'undefined') {
        alert("Erro: O arquivo 'questions.js' não foi carregado corretamente.");
        return;
    }

    // 2. Filtrar pelo intervalo da categoria
    let pool = questions.slice(selCat.start, selCat.end);
    
    // 3. Filtrar por dificuldade
    if (selDiff !== 'Todas') {
        pool = pool.filter(q => q.d.toLowerCase() === selDiff.toLowerCase());
    }
    
    // 4. Embaralhar
    pool = pool.sort(() => Math.random() - 0.5);
    
    // 5. Limitar quantidade
    pool = pool.slice(0, selQty);
    
    if (pool.length === 0) {
        alert("Não encontramos perguntas com esses critérios. Tente mudar a dificuldade.");
        return;
    }
    
    quizQuestions = pool;
    curQ = 0; score = 0; wrong = 0;
    
    showScreen('quiz');
    renderQuestion();
};

function renderQuestion() {
    answered = false;
    const q = quizQuestions[curQ];
    const tot = quizQuestions.length;
    
    // UI Updates
    document.getElementById('q-cur').textContent = curQ + 1;
    document.getElementById('q-tot').textContent = tot;
    document.getElementById('live-score').textContent = score;
    document.getElementById('prog').style.width = ((curQ) / tot * 100) + '%';
    document.getElementById('q-cat').textContent = selCat.label;
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('expl').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    const optsContainer = document.getElementById('opts');
    optsContainer.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.o.forEach((option, i) => {
        const b = document.createElement('button');
        b.className = 'opt-btn';
        b.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${option}</span>`;
        b.onclick = () => handleAnswer(i, q);
        optsContainer.appendChild(b);
    });
}

function handleAnswer(idx, q) {
    if (answered) return;
    answered = true;
    
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true);
    
    if (idx === q.a) {
        btns[idx].classList.add('correct');
        score++;
    } else {
        btns[idx].classList.add('wrong');
        btns[q.a].classList.add('correct');
        wrong++;
    }
    
    document.getElementById('live-score').textContent = score;
    
    const expl = document.getElementById('expl');
    expl.innerHTML = `<strong>Resposta correta: ${q.o[q.a]}</strong><br><br>${q.e}`;
    expl.style.display = 'block';
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.textContent = curQ < quizQuestions.length - 1 ? 'Próxima Pergunta →' : 'Ver Resultado Final';
    nextBtn.style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
    curQ++;
    if (curQ < quizQuestions.length) {
        renderQuestion();
    } else {
        showFinalResult();
    }
};

function showFinalResult() {
    const tot = quizQuestions.length;
    const pct = Math.round((score / tot) * 100);
    
    document.getElementById('r-pct').textContent = pct + '%';
    document.getElementById('r-cor').textContent = score;
    document.getElementById('r-wrg').textContent = wrong;
    document.getElementById('r-cat').textContent = selCat.label;
    document.getElementById('r-dif').textContent = selDiff;
    
    let msg = "Você pode melhorar!";
    if (pct >= 90) msg = "Incrível! Você é um mestre!";
    else if (pct >= 70) msg = "Muito bem! Ótimo conhecimento!";
    else if (pct >= 50) msg = "Bom trabalho! Continue estudando!";
    
    document.getElementById('r-msg').textContent = msg;
    
    showScreen('result');
}

document.getElementById('replay-btn').onclick = () => {
    document.getElementById('start-btn').click();
};

document.getElementById('home-btn').onclick = () => {
    showScreen('home');
};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}
