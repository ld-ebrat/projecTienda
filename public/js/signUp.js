const btnAccessLogin = document.querySelector(".access-login")
const selectCity = document.getElementById("select-city")
const log = document.querySelector(".log")
const sign = document.getElementById("SignUp")
const textspan = document.querySelector(".animacion-ls")
const imgSex = document.querySelector(".imgs-sex")

let indice = 0
const texto = ["Calidad", "Precios inigualables", "Mejores Ofertas"]
function mostrarTexto() {
    textspan.textContent = texto[indice]
    indice = (indice + 1) % texto.length
}
setInterval(mostrarTexto, 1500)

let tokenGlo;

var imgSelect;
imgSex.addEventListener("click", (e) => {

    if (e.target.tagName == "IMG") {
        imgSelect = `./img/${e.target.src.split("/").pop()}`
    }
})
log.addEventListener("click", () => {
    window.location.href = "/"
})
btnAccessLogin.addEventListener("click", () => {
    window.location.href = "/html/login.html"
})

sign.addEventListener("click", async () => {
    const nom = document.getElementById("name").value
    const ape = document.getElementById("sec-name").value
    const name = nom + " " + ape
    const email = document.getElementById("email").value
    const pass = document.getElementById("pass").value
    const city = selectCity[selectCity.selectedIndex].value
    const addres = ""
    const state = "Activo"

    if (name != "" && ape != "" && email != "" && pass != "" && city != "City" && imgSelect != "") {

        try {
            const response = await fetch("/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ city, imgSelect ,name, addres, state, email, pass })
            })

            if (response.ok) {
                const responseTo = await response.json()

                alert("Usuario Registrado Correctamente")
                localStorage.setItem("token", responseTo.token)
                window.location.href = "/"
            }else{
                const responseTo = await response.json()

                if(responseTo.code == 11000){
                    alert("El correo ya existe")
                }
            }
        } catch (err) {
            alert("Error al crear el usuario")
        }


    } else {
        alert("Rellena los campos faltates")
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")
    if(token){
        window.location.href = "/"
    }else{
            try {
        const response = await fetch("/read-city")
        selectCity.innerHTML = `
        <option selected>City</option>
        `
        if (response.ok) {
            const data = await response.json()

            data.forEach(city => {
                const opt = document.createElement("option")
                opt.value = city._id
                opt.innerText = city.name

                selectCity.appendChild(opt)
            })
        }
    } catch (err) {

    }
    }
    // await fetchToken()
    // await getCoutry()
})

async function fetchToken() {

    try {
        const response = await fetch("https://www.universal-tutorial.com/api/getaccesstoken", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "api-token": "1Af92vR0K_V_bZ9aMdxm68e8QfBjnX8To2hFekRZhkY8-bVbaAn-EA94cRKgfVZFXwE",
                "user-email": "angaritaheiner@gmail.com"
            }
        })

        if (response.ok) {
            const data = await response.json()
            tokenGlo = data
        }
    } catch (err) {
        console.log("error al obtener el token", err)
    }
}
async function getCoutry() {
    if (tokenGlo.auth_token) {
        const tokenAuth = tokenGlo.auth_token
        try {

            const responseCoutry = await fetch("https://www.universal-tutorial.com/api/countries", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${tokenAuth}`,
                    "Accept": "application/json"
                }
            })

            if (responseCoutry.ok) {
                const dataCountry = await responseCoutry.json()
                try {
                    const responseState = await fetch(`https://www.universal-tutorial.com/api/states/${dataCountry[46].country_name}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${tokenAuth}`,
                            "Accept": "application/json"
                        }
                    })

                    if (responseState.ok) {
                        const dataState = await responseState.json()

                        dataState.forEach(async (state) => {
                            try {
                                const responseCity = await fetch(`https://www.universal-tutorial.com/api/cities/${state.state_name}`, {
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${tokenAuth}`,
                                        "Accept": "application/json"
                                    }
                                })

                                if (responseCity.ok) {
                                    const dataCity = await responseCity.json()

                                    dataCity.forEach(async (city) => {
                                        const cityName = city.city_name
                                        try {
                                            const responseSetCity = await fetch("/create-city", {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({ cityName })
                                            })

                                            if (responseSetCity.ok) {
                                                console.log("Ciudad Agregado Correctamente")
                                            } else {
                                                console.log(responseSetCity.status)
                                            }
                                        } catch (err) {
                                            console.log("Error al registrar las ciudades ", err)
                                        }
                                    })
                                } else {
                                    console.log(responseCity.status)
                                }
                            } catch (err) {
                                console.log("Error al obtener las ciudad ", err)
                            }
                        })
                    } else {
                        console.log(responseState.status)
                    }
                } catch (err) {
                    console.log("Error al obtener los estados ", err)
                }
            } else {
                console.log(responseCoutry.status)
            }

        } catch (err) {
            console.log("Error al obtener los paises", err)
        }
    }
}
