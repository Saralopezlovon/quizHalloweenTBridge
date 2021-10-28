
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBKJVvpPUdX1vXZN3X1VIcbI9Bl7frvZY",
  authDomain: "quizhalloweenjs.firebaseapp.com",
  projectId: "quizhalloweenjs",
  storageBucket: "quizhalloweenjs.appspot.com",
  messagingSenderId: "991391770691",
  appId: "1:991391770691:web:4f3808641230843ab28cf6",
  measurementId: "G-SWX1S1YB66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore (app)

let user = ""

//Me guardo la variable que el usuario ha introducido 

document.getElementById('btn-start').addEventListener('click', () =>{
    user = document.getElementById('user').value    
})


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
           
           console.log("Este es mi contador de preguntas " + contador)
    
          }else{
            
            function showResult (){

                //Llamamos a los container del html y los declaramos en una constante

                const pantallaLanding =  document.getElementById("body-container-login")
                const pantallaQuiz =  document.getElementById("body-container-quiz")
                const pantallaResult =  document.getElementById("body-container-result")

                //Mostramos y ocultamos las pantallas

                pantallaLanding.style.display = "none"
                pantallaQuiz.style.display = "none"
                pantallaResult.style.display = "flex"

                //Añadimos en el h1 de pantallaResult el nombre

                document.getElementById("userTitle").innerText = user

                //Añadimos en el h2 de pantallaResult la puntuación                

                document.getElementById("userScore").innerText= countScore
               
            }

            showResult()

                        
            //Añadir datos en el Firebase tanto de usuario, como de su puntuación total

            document.getElementById('btn-ranking').addEventListener('click', async () =>{

              try {                
            
                const docRef = await addDoc(collection(db, "users"), {
                  name: user,
                  score: countScore,
                
                });            
            
                console.log("Document written with ID: ", docRef.id);
                
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            
            })

          }

      })
      
        
    }) 
}

drawQuiz()


let countScore = 0 ;


const validate = () => {      

    document.getElementById('option1').addEventListener('click', () => {       
        
        // alert ("Incorrect answer, try again!")
        document.getElementById("score").innerText= countScore
        console.log("Incorrecta"+countScore)
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
        console.log("La correcta"+countScore)     
        document.getElementById("btn-next").style.display= "flex"           

    })

    document.getElementById('option4').addEventListener('click', () => {
        
        // alert ("Incorrect answer, try again!")        

        document.getElementById("score").innerText= countScore
        document.getElementById("btn-next").style.display= "flex"
    })
    

}

validate()





