const pantallaLanding =  document.getElementById("body-container-login")
const pantallaQuiz =  document.getElementById("body-container-quiz")
const pantallaResultados = document.getElementById("body-container-result")
const pantallaGrafica = document.getElementById("body-container-graphic")

//Cuando hacemos click en empezar se oculta pantallaLanding y se muestra pantallaQuiz

document.getElementById('btn-start').addEventListener('click', ()=>{
    pantallaLanding.style.display = "none"
    pantallaQuiz.style.display = "flex"

})

//Volver a jugar

// document.getElementById("play-btn").addEventListener('click',()=>{

//     pantallaGrafica.style.display = "none"
//     pantallaResultados.style.display = "none"
//     pantallaQuiz.style.display = "none"                 
//     pantallaLanding.style.display = "flex"
   
   
//    })