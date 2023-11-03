import {getUser} from "./peticiones.js"

const btnMenuUser = document.querySelector('.user')
const btnCloseMenuUser = document.querySelector('.close-w-user')
const btnMenu = document.querySelector('.btn-menu')
const btnCloseMenu = document.querySelector('.close')
const logoHomeIndex = document.querySelector('.log-char')
const loginNav2 = document.querySelector('.signIn-nav2')
const divBtnLoginSign = document.querySelector(".sign")
const profile = document.querySelector('.container1-nav3-profile')
const carrito = document.querySelector('.carrito')
const consult = document.querySelector(".consult")
const pedido = document.querySelector(".container2-nav3-buy")
const exit = document.querySelector(".exit")

const divbg = document.querySelector('.div-opa')

const nav1 = document.getElementById('nav1')
const nav2 = document.getElementById('nav2')

logoHomeIndex.addEventListener('click', () => {
    window.location.href = '/'
})
loginNav2.addEventListener('click', () => {
    window.location.href = '/html/login.html'
})


nav1.addEventListener('click', e => {
    if (e.target.id == 'signIn') {
        window.location.href = '/html/login.html'
    } else if (e.target.id == 'signUp') {
        window.location.href = '/html/signUp.html'
    }
})
btnMenu.addEventListener('click', () => {
    const nav1 = document.getElementById('nav1')
    divbg.style.display = 'block'
    nav1.style.left = '0px'
})

btnCloseMenu.addEventListener('click', () => {
    const closeNav1 = document.getElementById('nav1')
    divbg.style.display = 'none'
    closeNav1.style.left = '-300px'
})

divbg.addEventListener('click', () => {
    const closeNav1 = document.getElementById('nav1')
    divbg.style.display = 'none'
    closeNav1.style.left = '-300px'
})

btnMenuUser.addEventListener('click', () => {
    const nav3 = document.getElementById('nav3')

    nav3.style.right = '0px'
})

profile.addEventListener("click", () => {
    window.location.href = "/html/profile.html"
})

consult.addEventListener("click", ()=>{
    window.location.href = "/html/pedidos.html"
})

exit.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.href = '/html/login.html'
})
btnCloseMenuUser.addEventListener('click', () => {
    const nav3 = document.getElementById('nav3')
    nav3.style.right = '-300px'
})

carrito.addEventListener("click", async () => {
    window.location.href = "/html/carrito.html"
})

document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token')
    const userNav2 = document.querySelector('.user')
    const imgUserNav2 = userNav2.querySelector('img')
    const infoNav3 = document.querySelector('.img-usuario-nav3')
    const containerNav2 = document.querySelector('.container-nav2-2')
    const nav3 = document.querySelector('#nav3')
    if (token) {
        const dataUser = await getUser(token)

        userNav2.style.display = 'block'
        containerNav2.style.margin = 0
        infoNav3.querySelector('span').innerText = dataUser.name
        if(document.querySelector("header").classList.contains("header-index")){
            imgUserNav2.src = dataUser.imgUser
            infoNav3.querySelector('img').src =dataUser.imgUser
        }else{
            imgUserNav2.src = `.${dataUser.imgUser}`
            infoNav3.querySelector('img').src = `.${dataUser.imgUser}`
        }
        nav3.style.display = 'flex'
        loginNav2.style.display = 'none'
        divBtnLoginSign.style.display = "none"

        if(dataUser._id == "65406f7c372f328747b0c3d9"){
            const gestion = document.querySelector(".container2-nav3-gestion")
            gestion.addEventListener("click", ()=>{
                window.location.href = "/html/gestionAdmin.html"
            })
            gestion.style.display = "flex"
            pedido.style.display = "none"
        }
    }
})


