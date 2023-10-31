const divProduct = document.querySelectorAll(".producto")
const totalPay = document.querySelector(".total-pay")
const procePay = document.querySelector(".proce-pay")
const metodo = document.querySelector(".diff-metodos")

let metodoPago;
let imgSelect;
divProduct.forEach(pro => {
    pro.addEventListener("click", (e) => {
        const priceProduct = pro.querySelector(".price")
        const spanAmount = pro.querySelector(".cantidad-producto").querySelector("span")
        const spanTotalPro = pro.querySelector(".div-totalProduct").querySelector(".total-product")
        if (e.target.classList.contains("less-amount")) {
            if (Number(spanAmount.innerText) != 0) {
                spanAmount.innerText = Number(spanAmount.innerText) - 1
                spanTotalPro.innerText = 0
                spanTotalPro.innerText = Number(spanAmount.innerText) * Number(priceProduct.innerText)
            }
        } else if (e.target.classList.contains("more-amount")) {
            spanAmount.innerText = Number(spanAmount.innerText) + 1
            spanTotalPro.innerText = 0
            spanTotalPro.innerText = Number(spanAmount.innerText) * Number(priceProduct.innerText)
        }

        if (e.target.classList.contains("less-amount") || e.target.classList.contains("more-amount")) {
            totalPay.innerText = 0
            divProduct.forEach(pro2 => {
                const spanTotalPro2 = pro2.querySelector(".div-totalProduct").querySelector(".total-product")
                totalPay.innerText = Number(totalPay.innerText) + Number(spanTotalPro2.innerText)
            })
        }

        divProduct.forEach()
    })
})

metodo.addEventListener("click", (e) => {
    if (imgSelect != undefined) {
        const imgPreSelect = imgSelect
        imgPreSelect.style.border = "none"
        imgSelect = e.target
        imgSelect.style.border = "1px solid"
        metodoPago = e.target.getAttribute("data-metodo")
    }else{
        imgSelect = e.target
        imgSelect.style.border = "1px solid"
        metodoPago = e.target.getAttribute("data-metodo")
    }
})

procePay.addEventListener("click", async () => {
    const token = localStorage.getItem("token")
    const date = new Date().toLocaleString()
    const total = Number(totalPay.innerText)
    const state = "Confirmado"

    if(token){

        if(metodoPago != undefined && total != 0){
            try{
                const user = await getUser(token)
    
                const car = await getCar(user._id)
    
                if(car){
                    const pedido = await putPedido(car.id_pedido,date,metodoPago,state,total)
                    const carUp = await putCar(car._id)
    
                    if(pedido && carUp){
                        alert("Pedido realizado con exito")
                    }
                }
            }catch(err){
                alert("Error al realizar el pedido")
            }
        }else{
            alert("Falta seleccionar metodo de pago o Productos")
        }
    }
})

async function getUser(token){

    try{
        const response = await fetch("/read-infoUser", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            }
        })

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){

    }
}
async function getCar(idUser){
    try{
        const response = await fetch("/read-car",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({idUser})
        })
        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log("Error en el fetch de getCar carrito -> ", err)
    }
}
async function putCar(idCar){
    try{
        const response = await fetch("/update-car", {
            method: "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({idCar})
        })

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log("Error al ahcer el fetch en putCar carrito -> ", err)
    }
}
async function putPedido(idPedido, date, metodo, state, total){
    try{
        const response = await fetch("/update-pedido", {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({idPedido, date, metodo, state, total})
        })

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log("Error al hacer el fetch putPedido en carrito -> ",err)
    }
}