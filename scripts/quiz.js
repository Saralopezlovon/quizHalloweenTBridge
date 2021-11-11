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

//Guardamos en una variable el usuario que se ha introducido

document.getElementById('btn-start').addEventListener('click', () =>{
    user = document.getElementById('user').value    
})

//Extraemos los datos de api Quiz en un array de objetos con preguntas y respuestas

let arrDatosTotal = [];
let arrCorrect = [];
let contador = 0;

const getQuestions = async () => {

    try {
      
        let response = await fetch(`https://opentdb.com/api.php?amount=10&category=27&difficulty=medium&type=multiple`)
        let data = await response.json()        
        let arrDatos = data.results  
        // console.log("Este es mi arrDatos: " + arrDatos)
        arrDatos.map(elemento =>{  
          arrCorrect.push(elemento.correct_answer)

          let objDatos = {
            Question: elemento.question,
            Answers: {
              0:{
                text: elemento.correct_answer,
                isCorrect: true
              },
              1:{
                text: elemento.incorrect_answers[0],
                isCorrect: false
              },
              2:{
                text: elemento.incorrect_answers[1],
                isCorrect: false
              },
              3:{
                text: elemento.incorrect_answers[2],
                isCorrect: false
              }
            }
          }
          arrDatosTotal.push(objDatos)
        })
       console.log(arrCorrect)
        return arrDatosTotal
    }
    catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }
}

//Declaramos una variable que utilizaremos para hacer random las respuestas

let orden =[0,1,2,3]

function getRandom (orden){
  orden.sort(()=>{
    return Math.random()- 0.5;    
  })

}

const drawQuiz =  () => {

  let i=0

    getQuestions()

    .then (arrDatosTotal=>{  
      document.getElementById('question').innerHTML= arrDatosTotal[0].Question
      document.getElementById('option1').innerHTML= arrDatosTotal[0].Answers[0].text
      document.getElementById('option1').setAttribute('value', arrDatosTotal[0].Answers[0].text)
      document.getElementById('option2').innerHTML = arrDatosTotal[0].Answers[1].text
      document.getElementById('option2').setAttribute('value', arrDatosTotal[0].Answers[1].text)
      document.getElementById('option3').innerHTML= arrDatosTotal[0].Answers[2].text
      document.getElementById('option3').setAttribute('value', arrDatosTotal[0].Answers[2].textt)
      document.getElementById('option4').innerHTML= arrDatosTotal[0].Answers[3].text
      document.getElementById('option4').setAttribute('value', arrDatosTotal[0].Answers[3].text)

      
      document.querySelectorAll('.options').forEach(item => {
        item.addEventListener('click', event => {

        getRandom(orden)
        // console.log(orden)

          if (contador < 9){
           contador++
           for (let i = 0 ; i< orden.length; i++){            
             document.getElementById('question').innerHTML= arrDatosTotal[contador].Question          
             document.getElementById('option1').innerHTML=arrDatosTotal[contador].Answers[orden[0]].text
             document.getElementById('option1').setAttribute('value', arrDatosTotal[contador].Answers[orden[0]].text)
             document.getElementById('option2').innerHTML = arrDatosTotal[contador].Answers[orden[1]].text
             document.getElementById('option2').setAttribute('value', arrDatosTotal[contador].Answers[orden[1]].text)    
             document.getElementById('option3').innerHTML= arrDatosTotal[contador].Answers[orden[2]].text
             document.getElementById('option3').setAttribute('value', arrDatosTotal[contador].Answers[orden[2]].text)
             document.getElementById('option4').innerHTML= arrDatosTotal[contador].Answers[orden[3]].text
             document.getElementById('option4').setAttribute('value', arrDatosTotal[contador].Answers[orden[3]].text)
           }
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

            //Añadimos los datos a firestore 
            document.getElementById('btn-ranking').addEventListener('click', async () =>{
              try {   

                //Añadimos el score total y el usuario 
                const docRef = await addDoc(collection(db, "users"), {
                  name: user,
                  score: countScore,
                })

                console.log("Document written with ID: ", docRef.id)

                //Leemos los datos de firestore

                let arrData =[]
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {

                  //Lo guardamos en un array con objetos por cada registro
                  arrData.push(doc.data())                    
                });

                // console.log(arrData)

                //El array obtenido lo ordenamos de mayor a menor segun la clave score

                arrData.sort((obj1, obj2)=>{
                  if(obj1.score > obj2.score){
                    return -1
                  }else if (obj1.score < obj2.score) {
                   return 1
                  }else{
                    return 0
                  }
                  });

                 //Extraemos las 10 primeras posiciones del array 

                  arrData = arrData.slice(0,10)

                 //Extraemos a partir de ello en 2 arrays los datos por registro del usuario y su puntuación

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

    })
}

drawQuiz()

//Realizamos una validación de respuestas que modifican el contador

let countScore = 0 ;
const validate = () => {      
    document.getElementById('option1').addEventListener('click', () => {
      let valorOption1 = document.getElementById('option1').getAttribute("value")
      console.log(valorOption1)
      if(valorOption1 === arrCorrect[contador]){
        countScore+=1         
      }
      
    })
    document.getElementById('option2').addEventListener('click', () => {
      let valorOption2 = document.getElementById('option2').getAttribute("value")
      console.log(valorOption2)
      if(valorOption2 === arrCorrect[contador] ){
        countScore+=1
      }
        
    })
    document.getElementById('option3').addEventListener('click', () => {
      let valorOption3 = document.getElementById('option3').getAttribute("value")
      console.log(valorOption3)
      if(valorOption3 === arrCorrect[contador] ){
        countScore+=1
      }
                  
    })
    document.getElementById('option4').addEventListener('click', () => {  
      let valorOption4 = document.getElementById('option4').getAttribute("value")
      console.log(valorOption4)
      if(valorOption4 === arrCorrect[contador] ){
        countScore+=1
      }
        
    })
}
validate()





