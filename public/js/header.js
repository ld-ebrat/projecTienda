const btnMenuUser = document.querySelector('.user')
const btnCloseMenuUser = document.querySelector('.close-w-user')
const btnMenu = document.querySelector('.btn-menu')
const btnCloseMenu = document.querySelector('.close')
const logoHomeIndex = document.querySelector('.log-char')
const loginNav2 = document.querySelector('.signIn-nav2')
const divBtnLoginSign = document.querySelector(".sign")
const profile = document.querySelector('.container1-nav3-profile')
const carrito = document.querySelector('.carrito')
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

profile.addEventListener("click", ()=>{
    window.location.href = "/html/profile.html"
})

exit.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location.href = '/html/login.html'
})
btnCloseMenuUser.addEventListener('click', () => {
    const nav3 = document.getElementById('nav3')
    nav3.style.right = '-300px'
})



carrito.addEventListener('click', async () => {
    const token = localStorage.getItem('token')
    if (token) {
        const idUser = (await getUser(token))._id
        console.log(idUser)
        const car = await getPostCar(idUser)
        console.log(car)
        if (car) {
            const main = document.querySelector('main')
            if (!main.classList.contains('main-carrito')) {
                const responseHtml = await fetch('/html/carrito.html')
                if (responseHtml.ok) {
                    const dataHtml = await responseHtml.text()
                    const parse = new DOMParser()
                    const boddy = parse.parseFromString(dataHtml, 'text/html')

                    boddy.body.querySelector('main').querySelector('#section-productos').innerHTML = `
                    <div class="titulo">
                        <h3>Carrito</h3>
                    </div>
                    <hr>
                    `
                    boddy.body.querySelector('main').querySelector('#section-pagar').querySelector('.pagar').innerHTML = `
                    <div class="pago">
                        <label>Metodos de Pago</label>
                        <div class="diff-metodos">
                            <div >
                                <img data-metodo="visa" src="../img/visa.png" alt="">
                            </div>
                            <div class="divImg-paypal">
                                <img data-metodo="paypal" src="../img/paypal.png" alt="">
                            </div>
                            <div class="divImg-bancolombia">
                                <img data-metodo="bancolombia" src="../img/logo-Bancolombia.png" alt="">
                            </div>
                            <div >
                                <img data-metodo="nequi" src="../img/nequi-logo.png" alt="">
                            </div>
                        </div>
                        <button class="proce-pay">Procesar Pago</button>
                    </div>
                    `

                    const carPro = await getPostCarPro(car._id)
                    console.log(carPro)

                    await htmlCarrito(carPro, boddy)
                    const pedido = await getPostPedido(car.id_pedido)
                    const totalAmout = document.createElement("div")
                    totalAmout.className = 'amount'
                    totalAmout.innerHTML = `
                        <span>Sub Total</span>
                        <span class="total-pay">${pedido.total}</span>
                    `
                    boddy.body.querySelector('main').querySelector('#section-pagar').querySelector('.pagar').prepend(totalAmout)

                    const link = document.createElement('link')
                    link.rel = 'stylesheet'
                    link.href = '/css/main-carrito.css'

                    const linkQuitar = document.querySelector("link[href='css/main-index.css']")
                    document.head.appendChild(link)
                    document.head.removeChild(linkQuitar)

                    const scriptNew = document.createElement('script')

                    scriptNew.src = './js/carrito.js'
                    const scriptQuitar = document.querySelector("script[src='./js/index.js']")
                    document.body.removeChild(scriptQuitar)
                    document.body.appendChild(scriptNew)

                    main.classList.add('main-carrito')
                    main.innerHTML = boddy.body.querySelector('main').innerHTML
                }
            }
        }else{
            const main = document.querySelector('main')
            if (!main.classList.contains('main-carrito')){
                const responseHtml = await fetch('/html/carrito.html')
                if (responseHtml.ok){
                    const dataHtml = await responseHtml.text()
                    const parse = new DOMParser()
                    const boddy = parse.parseFromString(dataHtml, 'text/html')

                    boddy.body.querySelector('main').querySelector('#section-productos').innerHTML = `
                    <div class="titulo">
                        <h3>Carrito</h3>
                    </div>
                    <hr>
                    `
                    boddy.body.querySelector('main').querySelector('#section-pagar').querySelector('.pagar').innerHTML = `
                    <div class="pago">
                        <label>Metodos de Pago</label>
                        <div class="diff-metodos">
                            <div >
                                <img data-metodo="visa" src="../img/visa.png" alt="">
                            </div>
                            <div class="divImg-paypal">
                                <img data-metodo="paypal" src="../img/paypal.png" alt="">
                            </div>
                            <div class="divImg-bancolombia">
                                <img data-metodo="bancolombia" src="../img/logo-Bancolombia.png" alt="">
                            </div>
                            <div >
                                <img data-metodo="nequi" src="../img/nequi-logo.png" alt="">
                            </div>
                        </div>
                        <button class="proce-pay">Procesar Pago</button>
                    </div>
                    `

                    const totalAmout = document.createElement("div")
                    totalAmout.className = 'amount'
                    totalAmout.innerHTML = `
                        <span>Sub Total</span>
                        <span class="total-pay">0</span>
                    `

                    boddy.body.querySelector('main').querySelector('#section-pagar').querySelector('.pagar').prepend(totalAmout)

                    const link = document.createElement('link')
                    link.rel = 'stylesheet'
                    link.href = '/css/main-carrito.css'

                    const linkQuitar = document.querySelector("link[href='css/main-index.css']")
                    document.head.appendChild(link)
                    document.head.removeChild(linkQuitar)

                    const scriptNew = document.createElement('script')

                    scriptNew.src = './js/carrito.js'
                    const scriptQuitar = document.querySelector("script[src='./js/index.js']")
                    document.body.removeChild(scriptQuitar)
                    document.body.appendChild(scriptNew)

                    main.classList.add('main-carrito')
                    main.innerHTML = boddy.body.querySelector('main').innerHTML
                }
            }
        }
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token')
    const userNav2 = document.querySelector('.user')
    const imgUserNav2 = userNav2.querySelector('img')
    const infoNav3 = document.querySelector('.img-usuario-nav3')
    const containerNav2 = document.querySelector('.container-nav2-2')
    const nav3 = document.querySelector('#nav3')
    if (token) {
        try {
            const responseInfoUser = await fetch('/read-infoUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": token
                }
            })

            if (responseInfoUser.ok) {
                const data = await responseInfoUser.json()

                userNav2.style.display = 'block'
                imgUserNav2.src = data.imgUser
                containerNav2.style.margin = 0
                infoNav3.querySelector('img').src = data.imgUser
                infoNav3.querySelector('span').innerText = data.name
                nav3.style.display = 'flex'
                loginNav2.style.display = 'none'
                divBtnLoginSign.style.display = "none"
            }
        } catch (err) {
            console.log('Error al leer el usuario', err)
        }
    }
})

function htmlCarrito(carPro, body) {
    carPro.forEach(async carpro => {
        const product = document.createElement('div')
        product.className = 'producto'
        console.log(carpro)
        const pro = await getPostPro(carpro.id_producto)
        console.log(pro)
        product.innerHTML = `
        <div class="img-producto">
            <img src="${pro.imagen}">
        </div>
        <div class="info-producto">
            <span>${pro.name}</span>
            <span class="price">${pro.price}</span>
            <div class="cantidad-producto">
                <button class="less-amount">-</button>
                <span>${carpro.amount}</span>
                <button class="more-amount">+</button>
            </div>
        </div>
        <div class="div-totalProduct">
            <span>Total Producto</span>
            <span class="total-product">${carpro.amount * pro.price}</span>
        </div>
        `

        await body.body.querySelector('main').querySelector('#section-productos').appendChild(product)
    })
}
async function getUser(token) {
    try {
        const response = await fetch('/read-infoUser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            }
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log('Error al hacer el fetch en getUser header -> ', err)
    }
}
async function getPostCar(idUser) {
    try {
        const response = await fetch('/read-car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idUser })
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log('Error al hacer el fetch en el getPostCar de header -> ', err)
    }
}
async function getPostCarPro(idCar) {
    try {
        const response = await fetch('/read-carPro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idCar })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) { }
}
async function getPostPro(idPro) {
    try {
        const response = await fetch('/read-pro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPro })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log('Error al realizar el fetch en getPro header -> ', err)
    }
}
async function getPostPedido(idPedido){
    try{
        const response = await fetch("/read-pedido",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({idPedido})
        })

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log("Error al hacer el fetch aqui en el getPostPedido -> ", err)
    }
}




