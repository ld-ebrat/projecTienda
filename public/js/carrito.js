import {getUser,getPostCar,getPostCarPro,getPostPro,getPostPedido,putCar,putPedido, putCarPro} from "./peticiones.js"
const divProduct = document.querySelectorAll(".producto")
const totalPay = document.querySelector(".total-pay")
const procePay = document.querySelector(".proce-pay")
const metodo = document.querySelector(".diff-metodos")
const les = document.querySelectorAll(".less-amount")
const sectionPro = document.getElementById("section-productos")

let metodoPago;
let imgSelect;

sectionPro.addEventListener("click", (e)=>{
    console.log(document.querySelectorAll(".producto"))
    if(e.target.classList.contains("less-amount")){
        var spanAmount = e.target.nextElementSibling
        const price = e.target.closest(".producto").querySelector(".price")
        const totalProduct = e.target.closest(".producto").querySelector(".total-product")
        if(Number(spanAmount.innerText) >0){
            spanAmount.innerText = Number(spanAmount.innerText)-1
            totalProduct.innerText = Number(totalProduct.innerText)-Number(price.innerText)
            totalPay.innerText = Number(totalPay.innerText)-Number(price.innerText)
        }
        console.log(e.target.nextElementSibling)
    }else if(e.target.classList.contains("more-amount")){
        var spanAmount = e.target.previousElementSibling
        const price = e.target.closest(".producto").querySelector(".price")
        const totalProduct = e.target.closest(".producto").querySelector(".total-product")

        spanAmount.innerText = Number(spanAmount.innerText)+1
        totalProduct.innerText = Number(totalProduct.innerText)+Number(price.innerText)
        totalPay.innerText = Number(totalPay.innerText)+Number(price.innerText)
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")

    sectionPro.innerHTML = `
    <div class="titulo">
        <h3>Carrito</h3>
    </div>
    <hr>
    `

    if (token) {
        const dataUser = await getUser(token)
        const dataCar = await getPostCar(dataUser._id)
        if (dataCar) {
            const dataCarPro = await getPostCarPro(dataCar._id)
            totalPay.innerText = dataCar.id_pedido.total
            dataCarPro.forEach(async carPro => {
                const divPro = document.createElement("div")
                const hr = document.createElement("hr")
                divPro.className = "producto"
                const pro = carPro.id_producto
                divPro.setAttribute("data-id",pro._id)
                divPro.innerHTML = `
                <div class="img-producto">
                    <img src="${pro.imagen}" alt="">
                </div>
                <div class="info-producto">
                    <span>${pro.name}</span>
                    <span class="price">${pro.price}</span>

                    <div class="cantidad-producto">
                        <button class="less-amount">-</button>
                        <span>${carPro.amount}</span>
                        <button class="more-amount">+</button>
                    </div>
                </div>
                <div class="div-totalProduct">
                    <span>Total Producto</span>
                    <span class="total-product">${carPro.amount*pro.price}</span>
                </div>
                `
                sectionPro.appendChild(divPro)
                sectionPro.appendChild(hr)
            })
        }
    }


})

metodo.addEventListener("click", (e) => {
    if (imgSelect != undefined) {
        const imgPreSelect = imgSelect
        imgPreSelect.style.border = "none"
        imgSelect = e.target
        imgSelect.style.border = "1px solid"
        metodoPago = e.target.getAttribute("data-metodo")
    } else {
        imgSelect = e.target
        imgSelect.style.border = "1px solid"
        metodoPago = e.target.getAttribute("data-metodo")
    }
})

procePay.addEventListener("click", async ()=>{
    const token = localStorage.getItem("token")
    const total = Number(totalPay.innerText)
    if(token){
        const user = await getUser(token)
        const car = await getPostCar(user._id)
        if(car){
            if(["visa","paypal","bancolombia","nequi",].includes(metodoPago)){
                const pedido = await putPedido(car.id_pedido._id,total,metodoPago,"Aceptado")

                const carPro = await getPostCarPro(car._id)
                const product = Array.from(sectionPro.querySelectorAll(".producto"))
                carPro.forEach(async carpro =>{
                    console.log(carpro)
                    const indice = product.findIndex(pro=>{
                        return pro.getAttribute("data-id") === carpro.id_producto
                    })
                    console.log(indice)
                    console.log(product[indice].querySelector(".cantidad-producto span").innerText)
                    const amount = Number(product[indice].querySelector(".cantidad-producto span").innerText)
                    const carProUp = await putCarPro(carpro._id,amount)
                })

                if(pedido){
                    const carUpt = await putCar(car._id)
                    if(carUpt){
                        alert("Pago Procesado con existo")
                        window.location.href = "/html/carrito.html"
                    }
                }
            }else{
                alert("Seleccione un metodo de pago")
            }
        }else{
            alert("Añadir Productos")
        }
    }else{
        window.location.href ="/html/login.html"
    }
})
