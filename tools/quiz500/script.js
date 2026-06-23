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

    if(current>=questions.length){

        document.querySelector(".question-box").innerHTML=`
        <h2>Quiz concluído!</h2>
        <h3>Você acertou ${points} de ${questions.length}</h3>
        `;

        return;
    }

    showQuestion();

}
