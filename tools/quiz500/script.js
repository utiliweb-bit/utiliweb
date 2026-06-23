let current = 0;
let points = 0;

showQuestion();

function showQuestion(){

    document.getElementById("nextBtn").style.display="none";
    document.getElementById("explanation").innerHTML="";

    let q = questions[current];

    document.getElementById("counter").innerHTML =
        `${current+1}/${questions.length}`;

    document.getElementById("question").innerHTML = q.q;

    let answers = document.getElementById("answers");
    answers.innerHTML="";

    q.o.forEach((option,index)=>{

        let btn = document.createElement("button");

        btn.className="answer";
        btn.innerHTML=option;

        btn.onclick=()=>checkAnswer(index,btn);

        answers.appendChild(btn);

    });

}

function checkAnswer(index,button){

    let q = questions[current];

    let buttons = document.querySelectorAll(".answer");

    buttons.forEach(btn=>btn.disabled=true);

    if(index===q.a){

        button.classList.add("correct");
        points++;

    }else{

        button.classList.add("wrong");
        buttons[q.a].classList.add("correct");

    }

    document.getElementById("score").innerHTML =
        `Pontuação: ${points}`;

    document.getElementById("explanation").innerHTML =
        q.e;

    document.getElementById("nextBtn").style.display="block";

}

function nextQuestion(){
    current++;
    if(current >= questions.length){
        showResult();
        return;
    }
    showQuestion();
}

function showResult(){
    const box = document.querySelector(".question-box");
    box.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>Quiz concluído!</h2>
            <p style="font-size: 1.2em;">Você acertou <strong>${points}</strong> de <strong>${questions.length}</strong> perguntas.</p>
            <p style="font-size: 1.1em;">Desempenho: ${Math.round((points/questions.length)*100)}%</p>
            <button onclick="location.reload()" class="answer" style="margin-top: 20px; cursor: pointer;">Reiniciar Quiz</button>
        </div>
    `;
}
