//Extraemos los datos de api Quiz: preguntas, respuestas correctas, respuesta incorrecta

const getQuestions = async () => {

    try {        

        let response = await fetch(`https://opentdb.com/api.php?amount=10&category=27&difficulty=medium&type=multiple`)

        let data = await response.json()        

        let arrDatos = data.results       

        let questions = arrDatos.map((elemento)=>{
            return (elemento.question)})

        let correctAnswer = arrDatos.map((elemento)=>{
            return (elemento.correct_answer)})

        let incorrectAnswers =arrDatos.map((elemento)=>{
            return(elemento.incorrect_answers)})     
           
                                   
        let objDatos = {questions,correctAnswer,incorrectAnswers}
       

        return objDatos ; 

    }

    catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }

}

const drawQuiz =  () => {
   
    getQuestions()

    .then (objDatos=>{

    //   console.log(objDatos) 

      document.getElementById('question').innerHTML= `${objDatos.questions[0]}`

       let incorrect = objDatos.incorrectAnswers[0] 

      document.getElementById('option1').innerHTML=`${incorrect[0]}`        

      document.getElementById('option2').innerHTML = `${incorrect[1]}`

      document.getElementById('option3').innerHTML=`${objDatos.correctAnswer[0]}`

      document.getElementById('option4').innerHTML= `${incorrect[2]}`         
        
    }) 
}

drawQuiz()


const validate = () => {    

    document.getElementById('option1').addEventListener('click', () => {
        document.getElementById("body").style.backgroundColor = "red"
        alert ("Incorrect answer, try again!")
    })

    document.getElementById('option2').addEventListener('click', () => {
        document.getElementById("body").style.backgroundColor = "red"
        alert ("Incorrect answer, try again!")
    })

    document.getElementById('option3').addEventListener('click', () => {
        document.getElementById("body").style.backgroundColor = "green"
        alert ("Congratulations! This is the right one!")
        document.getElementById("btn-next").display= "flex"

    })

    document.getElementById('option4').addEventListener('click', () => {
        document.getElementById("body").style.backgroundColor = "red"
        alert ("Incorrect answer, try again!")
    })




}


validate()

