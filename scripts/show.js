const pantallaLanding =  document.getElementById("body-container-login")
const pantallaQuiz =  document.getElementById("body-container-quiz")

//Cuando hacemos click en empezar se oculta pantallaLanding y se muestra pantallaQuiz

document.getElementById('btn-start').addEventListener('click', ()=>{
    pantallaLanding.style.display = "none"
    pantallaQuiz.style.display = "flex"

})

