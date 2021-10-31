
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

//Guardar la variable que el usuario ha introducido 

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

      document.getElementById('question').innerHTML= `${objDatos.questions[0]}`

       let incorrect = objDatos.incorrectAnswers[0] 

      document.getElementById('option1').innerHTML=incorrect[0]        

      document.getElementById('option2').innerHTML = incorrect[1]

      document.getElementById('option3').innerHTML=objDatos.correctAnswer[0]

      document.getElementById('option4').innerHTML= incorrect[2]      


      let contador = 0;

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
            
            function showResult (){

                //Llamamos a los container del html y los declaramos en una constante

                const pantallaLanding =  document.getElementById("body-container-login")
                const pantallaQuiz =  document.getElementById("body-container-quiz")
                const pantallaResult =  document.getElementById("body-container-result")

                //Ocultamos las dos primeras pantallas y mostramos la de resultados del usuario

                pantallaLanding.style.display = "none"
                pantallaQuiz.style.display = "none"
                pantallaResult.style.display = "flex"

                //Añadimos en el h1 de pantallaResult el nombre del usuario

                document.getElementById("userTitle").innerText = `¡Enhorabuena ${user}!`

                //Añadimos en el h2 de pantallaResult la puntuación del usuario                

                document.getElementById("userScore").innerText= `Tu puntuación es: ${countScore}` 
               
            }

            showResult()

                        
            //Añadir datos en el Firebase tanto de usuario, como de su puntuación total

            document.getElementById('btn-ranking').addEventListener('click', async () =>{

              try {      
                
                //Añadir el score total y el usuario a firestore
            
                const docRef = await addDoc(collection(db, "users"), {
                  name: user,
                  score: countScore,
                
                })     

                console.log("Document written with ID: ", docRef.id)

                //Leemos los datos de firestore
                
                let arrData =[]

                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {

                  //Lo guardamos en un array con muchos objetos 

                  arrData.push(doc.data())                     
            
                });

                console.log(arrData)

                arrData.sort((obj1, obj2)=>{

                  if(obj1.score > obj2.score){
                    return -1
                  }else if (obj1.score < obj2.score) {
                   return 1
                  }else{
                    return 0
                  }
                  
                  });
                  
                  arrData = arrData.slice(0,10)
                  
                  let arrUsers=[]
                  let arrScore=[]
                  
                  for (let i=0; i < arrData.length; i++){ 
                    arrUsers.push(arrData[i].name)
                    arrScore.push(arrData[i].score)
                  }

                //Añadimos al eje x y eje y los arrays de usuarios y puntuaciones
                  
                  // console.log(arrUsers)
                  // console.log(arrScore)
                  
                  const ctx = document.getElementById('myChart').getContext('2d');
                  const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                      labels: arrUsers,
                      datasets: [{
                          label: 'Scores',
                          data: arrScore,
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                          ],
                          borderWidth: 1,
                        }]
                    },

                    options: {
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        }
                      }
                    }
                  });

                //Ocultamos la pantalla de resultados del usuario y mostramos la del ranking

                document.getElementById("body-container-result").style.display = "none"
                document.getElementById("body-container-graphic").style.display = "flex"              

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
 
        document.getElementById("btn-next").style.display= "flex"
        
    })

    document.getElementById('option2').addEventListener('click', () => {

        document.getElementById("btn-next").style.display= "flex"

    })

    document.getElementById('option3').addEventListener('click', () => {
        
        countScore+=1
   
        document.getElementById("btn-next").style.display= "flex"           

    })

    document.getElementById('option4').addEventListener('click', () => {    
     
        document.getElementById("btn-next").style.display= "flex"
    })
    

}

validate()





