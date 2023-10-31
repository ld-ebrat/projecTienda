const btnUpd = document.querySelector(".update-info")
const img = document.querySelector(".divImg img")
const select = document.querySelector("#select-city")
const nombre = document.querySelector("#name")
const ciudad = document.querySelector("#ciudad")
const direct = document.querySelector("#direccion")
const email = document.querySelector("#email")
const home = document.querySelector(".home")

let user
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")
    if (token) {
        user = await getUser(token)
        console.log(user)
        if (user) {
            select.innerHTML = `
                <option value="selection-city">Seleccionar ciudad</option>
            `
            const City = await getCity()
            img.src = `.${user.imgUser}`
            nombre.value = user.name
            direct.value = user.address
            email.value = user.email
            console.log(City)
            City.forEach(city => {
                const opt = document.createElement("option")
                opt.value = city._id
                opt.innerText = city.name
                select.appendChild(opt)

                if (city._id == user.id_city) {
                    ciudad.value = city.name
                    ciudad.getAttribute("data-id") = city._id
                }
            })
        }
    }
})

btnUpd.addEventListener("click", async ()=>{
    const very = document.querySelector("#veryCity")
    if(very.checked && select[select.selectedIndex].value != 'selection-city'){
        const uptdate = await putUser(user._id,nombre.value,email.value,direct.value,select[select.selectedIndex].value)
        if(uptdate){
            alert("Datos actualizados Correctamente")
        }
    }else{
        const uptdate = await putUser(user._id,nombre.value,email.value,direct.value,ciudad.getAttribute("data-id"))
        if(uptdate){
            alert("Datos actualizados Correctamente")
        }
    }
})
home.addEventListener("click", ()=>{
    window.location.href = "/"
})
async function getUser(token) {
    try {
        const response = await fetch("/read-infoUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'authorization': token
            }
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log("Erro al hacer el fetch en geUser prifle -> ", err)
    }
}
async function getCity() {
    try {
        const response = await fetch("/read-city")
        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log("Error al realizar el fetch en getCity profile -> ", err)
    }
}
async function putUser(idUser, name, email, direct, city) {
    try {
        const response = await fetch("/update-user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUser, name, email, direct, city })
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log("Error al hacer el fetch de putUser profile -> ", err)
    }
}