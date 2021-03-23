fetch('https://quiztai.herokuapp.com/api/quiz')
    	.then(resp => resp.json())
    	.then(resp => {
            preQuestions = resp;
            
            //variables
            let next = document.querySelector('.next');
            let previous = document.querySelector('.previous');
            let question = document.querySelector('.question');
            let questionNumber = document.querySelector('.question-number');
            let answers = document.querySelectorAll('.list-group-item');
            let pointsElem = document.querySelector('.score');
            let restart = document.querySelector('.restart');
            let list = document.querySelector('.list');
            let results = document.querySelector('.results');
            let userScorePoint = document.querySelector('.userScorePoint');
            let average = document.querySelector('.average');
            let index = 0;
            let points = 0;

            //my history array
            let answerClicked = new Array(preQuestions.length);
            clearHistory();

            //function calls
            setQuestion(index);

            //function definitions
            function setQuestion(index) {
                //set divs question and question number
                questionNumber.innerHTML = (index+1);
                question.innerHTML = preQuestions[index].question;
                //make all answers block invisible
                for(let i=0; i<4; i++){
                    answers[i].style.display='none';
                }
                //show only those blocks which contains answers and remove selection color if exist
                for(let i=0; i<preQuestions[index].answers.length; i++){
                    answers[i].innerHTML = preQuestions[index].answers[i];
                    answers[i].style.display='block';
                    if(answers[i].classList.contains('correct')){answers[i].classList.remove('correct')}
                    else if(answers[i].classList.contains('incorrect')){answers[i].classList.remove('incorrect')};
                }
                //see if answer was clicked before so nobody can change his answer
                if(answerClicked[index][0] == false) {
                    activateAnswers();
                } else {
                    disableAnswers()
                };
                //show selection on answer if was already clicked
                if(answerClicked[index][0]) {
                    clickedIndex = answerClicked[index][1];
                    if(preQuestions[index].answers[clickedIndex] === preQuestions[index].correct_answer){
                        markCorrect(answers[clickedIndex]);
                    } else {
                        markInCorrect(answers[clickedIndex]);
                    }
                }
            }

            function markCorrect(elem){
                elem.classList.add('correct');
            }

            function markInCorrect(elem){
                elem.classList.add('incorrect');
            }

            function disableAnswers(){
                for (let i = 0; i < answers.length; i++) {
                    answers[i].removeEventListener('click', check);
                }
            }

            function activateAnswers() {
                for (let i = 0; i < answers.length; i++) {
                    answers[i].addEventListener('click', check);
                }
            }

            function check(event) {
                //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
                if (event.target.innerHTML === preQuestions[index].correct_answer) {
                    points++;
                    pointsElem.innerText = points;
                    markCorrect(event.target);
                }
                else {
                    markInCorrect(event.target);
                }
                disableAnswers();
                //zapisuje zaznaczoną odpowiedź
                answerClicked[index]=[true, findAnswerIndex(event.target.innerHTML)];
            }

            function findAnswerIndex(answer){
                //zwraca index wybranej odpowiedzi
                for(let i=0; i<preQuestions[index].answers.length; i++){
                    if(answer === preQuestions[index].answers[i]){
                        return i;
                    }
                }
            }

            function clearHistory(){
                for(let i=0; i<preQuestions.length; i++){
                    answerClicked[i] = [false, null];
                }
                pointsElem.innerText = points;
            }

            function averageFromLocalStorage(){
                let sum = 0;
                for (let i=0; i<localStorage.length; i++){
                    sum += JSON.parse(localStorage.getItem(localStorage.key(i)));
                }
                let avg = sum/localStorage.length;
                avg = Math.round(avg * 100) / 100;
                return avg;
            }

            //event listeners
            previous.addEventListener('click', function () {
                if (index > 0) {
                    setQuestion(--index);
                }
            });

            next.addEventListener('click', function () {
                if (index+1 >= preQuestions.length) {
                    list.style.display = 'none';
                    results.style.display = 'block';
                    userScorePoint.innerHTML = points;
                    localStorage.setItem("attempt"+localStorage.length, JSON.stringify(points));
                    average.innerHTML = averageFromLocalStorage();
                } else {
                    index++;
                    setQuestion(index);
                }

            });

            restart.addEventListener('click', function (event) {
                event.preventDefault();
                index = 0;
                points = 0;
                userScorePoint.innerHTML = points;
                clearHistory();
                setQuestion(index);
                list.style.display = 'block';
                results.style.display = 'none';
            });
});