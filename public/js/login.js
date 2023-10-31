let indice = 0
const texto = ["Calidad", "Precios inigualables", "Mejores Ofertas"]

const textspan = document.querySelector(".animacion-ls")
function mostrarTexto() {
    textspan.textContent = texto[indice]
    indice = (indice + 1) % texto.length
}

setInterval(mostrarTexto, 1500)

const btnAccessSignUp = document.querySelector(".access-signUp")
const log = document.querySelector(".log")
const btnLogin = document.getElementById("access-entry")

log.addEventListener("click", ()=>{
    window.location.href = "/"
})

btnLogin.addEventListener("click", async ()=>{
    const email = document.querySelector(".email").value
    const pass = document.querySelector(".pass").value

    try{
        const responseAccesLogin = await fetch("/user/login", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                pass
            })
        })

        if(responseAccesLogin.ok){
            const dataAccesLogin = await responseAccesLogin.json()
            window.location.href = "/"
            localStorage.setItem("token",dataAccesLogin.token)
            console.log(dataAccesLogin)
        }
    }catch(err){
        console.log("Error al realizar el login", err)
    }
})

document.addEventListener("DOMContentLoaded", ()=>{
    const token = localStorage.getItem("token")

    if(token){
        window.location.href = "/"
    }
})

btnAccessSignUp.addEventListener("click", ()=>{
    window.location.href = "/html/signUp.html"
})
