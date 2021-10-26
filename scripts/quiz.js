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

      document.getElementById('option1').innerHTML=incorrect[0]        

      document.getElementById('option2').innerHTML = incorrect[1]

      document.getElementById('option3').innerHTML=objDatos.correctAnswer[0]

      document.getElementById('option4').innerHTML= incorrect[2]      


      let contador = 1;

      document.getElementById('btn-next').addEventListener('click', ()=>{

          if (contador < 9){

            contador++
    
            document.getElementById('question').innerHTML= objDatos.questions[contador]
    
            incorrect = objDatos.incorrectAnswers[contador] 


     
           document.getElementById('option1').innerHTML= incorrect[0]        
     
           document.getElementById('option2').innerHTML = incorrect[1]
     
           document.getElementById('option3').innerHTML= objDatos.correctAnswer[contador]
     
           document.getElementById('option4').innerHTML= incorrect[2]       
    
          }else{

            console.log("Aqui debo poner la pagina de resultados")

          }

      })
      
        
    }) 
}

drawQuiz()

let puntuacion = [];
let usuario = []
let countScore = 0 ;


const validate = () => {  

    document.getElementById('option1').addEventListener('click', () => {       
        
        // alert ("Incorrect answer, try again!")
        document.getElementById("score").innerText= countScore
        document.getElementById("btn-next").style.display= "flex"
        
    })

    document.getElementById('option2').addEventListener('click', () => {
        
        // alert ("Incorrect answer, try again!")
        document.getElementById("score").innerText= countScore
        document.getElementById("btn-next").style.display= "flex"

    })

    document.getElementById('option3').addEventListener('click', () => {
       
        // alert ("Congratulations! This is the right one!")
        
        countScore+=1

        document.getElementById("score").innerText= countScore      
        document.getElementById("btn-next").style.display= "flex"           

    })

    document.getElementById('option4').addEventListener('click', () => {
        
        // alert ("Incorrect answer, try again!")        

        document.getElementById("score").innerText= countScore
        document.getElementById("btn-next").style.display= "flex"
    })

 

}

validate()

