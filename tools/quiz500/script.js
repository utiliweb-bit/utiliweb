const CATEGORIES = [
  { id: 'historia',    label: 'História',       icon: '🏛️', start: 0, end: 100 },
  { id: 'ciencias',    label: 'Ciências',       icon: '🔬', start: 100, end: 200 },
  { id: 'geografia',   label: 'Geografia',      icon: '🌍', start: 200, end: 300 },
  { id: 'cultura',     label: 'Cultura Geral',  icon: '🎭', start: 300, end: 400 },
  { id: 'esportes',    label: 'Esportes',       icon: '⚽', start: 400, end: 500 },
];

let selCat = null, selDiff = 'Todas', selQty = 10;
let quizQuestions = [], curQ = 0, score = 0, wrong = 0, answered = false;

/* ─── Build home UI ─── */
const catGrid = document.getElementById('cat-grid');
CATEGORIES.forEach(c => {
  const b = document.createElement('button');
  b.className = 'cat-btn';
  b.innerHTML = `<span class="cat-icon">${c.icon}</span>${c.label}`;
  b.dataset.id = c.id;
  b.onclick = () => {
    document.querySelectorAll('.cat-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    selCat = c;
    updateStart();
  };
  catGrid.appendChild(b);
});

function makePillRow(rowId, onchange) {
  document.querySelectorAll(`#${rowId} .pill-btn`).forEach(b => {
    b.onclick = () => {
      document.querySelectorAll(`#${rowId} .pill-btn`).forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      onchange(b.dataset.v);
    };
  });
}

makePillRow('diff-row', v => { selDiff = v; });
makePillRow('qty-row',  v => { selQty = parseInt(v); });

function updateStart() {
  const sb = document.getElementById('start-btn');
  sb.disabled = !selCat;
  sb.textContent = selCat ? 'Começar' : 'Escolha uma categoria';
}

/* ─── Game Logic ─── */
document.getElementById('start-btn').onclick = () => {
  if (!selCat) return;
  
  // Filtrar perguntas da categoria selecionada do array global 'questions'
  let pool = questions.slice(selCat.start, selCat.end);
  
  // Filtrar por dificuldade se necessário
  if (selDiff !== 'Todas') {
    pool = pool.filter(q => q.d.toLowerCase() === selDiff.toLowerCase());
  }
  
  // Embaralhar e limitar à quantidade escolhida
  pool = pool.sort(() => Math.random() - 0.5).slice(0, selQty);
  
  if (!pool.length) {
    alert('Nenhuma pergunta encontrada para esta combinação de categoria e dificuldade.');
    return;
  }
  
  quizQuestions = pool;
  curQ = 0; score = 0; wrong = 0;
  show('quiz');
  renderQ();
};

function renderQ() {
  answered = false;
  const q = quizQuestions[curQ];
  const tot = quizQuestions.length;
  
  document.getElementById('q-cur').textContent = curQ + 1;
  document.getElementById('q-tot').textContent = tot;
  document.getElementById('live-score').textContent = score;
  document.getElementById('live-wrong').textContent = wrong;
  document.getElementById('prog').style.width = (curQ / tot * 100) + '%';
  document.getElementById('q-cat').textContent = selCat.label;
  document.getElementById('q-diff').textContent = q.d;
  document.getElementById('q-text').textContent = q.q;
  document.getElementById('expl').style.display = 'none';
  document.getElementById('next-btn').style.display = 'none';

  const opts = document.getElementById('opts');
  opts.innerHTML = '';
  ['A','B','C','D'].forEach((letter, i) => {
    const b = document.createElement('button');
    b.className = 'opt-btn';
    b.innerHTML = `<span class="opt-letter">${letter}</span><span>${q.o[i]}</span>`;
    b.onclick = () => pick(i, q);
    opts.appendChild(b);
  });
}

function pick(idx, q) {
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
  document.getElementById('live-wrong').textContent = wrong;
  
  const expl = document.getElementById('expl');
  expl.textContent = q.e;
  expl.style.display = 'block';
  
  const nb = document.getElementById('next-btn');
  nb.textContent = curQ < quizQuestions.length - 1 ? 'Próxima →' : 'Ver resultado';
  nb.style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
  curQ++;
  if (curQ < quizQuestions.length) {
    renderQ();
  } else {
    showResult();
  }
};

function showResult() {
  const tot = quizQuestions.length;
  const pct = Math.round((score / tot) * 100);
  document.getElementById('r-pct').textContent = pct + '%';
  
  const grades = [
    [95,'Perfeito! 🏆'],
    [80,'Excelente! 🌟'],
    [60,'Muito bom! 🎉'],
    [40,'Bom esforço! 👍'],
    [0,'Continue praticando! 💪']
  ];
  
  document.getElementById('r-msg').textContent = grades.find(g => pct >= g[0])[1];
  document.getElementById('r-cor').textContent = `${score} / ${tot}`;
  document.getElementById('r-wrg').textContent = `${wrong} / ${tot}`;
  document.getElementById('r-cat').textContent = selCat.label;
  document.getElementById('r-dif').textContent = selDiff;
  show('result');
}

document.getElementById('replay-btn').onclick = () => {
  document.getElementById('start-btn').click();
};

document.getElementById('home-btn').onclick = () => {
  show('home');
};

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
