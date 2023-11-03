import { getUser, getPostCar, getPostPedido, getPostCarPro, getPro, getCategoria, putCar, putPedido } from "./peticiones.js"
const sectionOpciones = document.getElementById("section-opciones")
const aceptado = document.querySelector(".acept")
const onPath = document.querySelector(".on-path")
const cancelado = document.querySelector(".canceled")
const confirmados = document.querySelector(".confirmed")
const home = document.querySelector("#home")

document.addEventListener("DOMContentLoaded", () => {
    sectionOpciones.innerHTML = `
    <div class="opciones">
        <button class="pending">Pendientes</button>
        <button class="acept">Aceptados</button>
        <button class="on-path">En camino</button>
        <button class="canceled">Cancelados</button>
        <button class="confirmed">Confirmados</button>
    </div>
    `
})
home.addEventListener("click", () => {
    window.location.href = "/"
})
sectionOpciones.addEventListener("click", async (e) => {
    const token = localStorage.getItem("token")
    if (token) {
        const user = await getUser(token)
        if (e.target.classList.contains("pending")) {
            sectionOpciones.innerHTML = `
                <div class="opciones">
                    <button class="pending">Pendientes</button>
                    <button class="acept">Aceptados</button>
                    <button class="on-path">En camino</button>
                    <button class="canceled">Cancelados</button>
                    <button class="confirmed">Confirmados</button>
                </div>
            `
            const table = document.createElement("table")
            table.className = "pedidos"
            table.innerHTML = `
                <tr>
                    <th>ID pedido</th>
                    <th>Fecha</th>
                    <th>Metodo de pago</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Ver Productos</th>
                    <th>Cancelar</th>
                </tr>
                `
            const car = await getPostCar(user._id)
            console.log(car)
            if (car) {
                const pedido = car.id_pedido
                const tr = document.createElement("tr")

                tr.innerHTML = `
                        <td>${pedido._id}</td>
                        <td>${pedido.date}</td>
                        <td>${pedido.payment_method}</td>
                        <td>${pedido.state}</td>
                        <td>${pedido.total}</td>
                        <td><button class="see-order">ver Productos</button></td>
                        <td><button class="delete-order">Cancelar</button></td>
                    `
                table.appendChild(tr)
            }

            sectionOpciones.appendChild(table)
        } else if (e.target.classList.contains("acept")) {
            sectionOpciones.innerHTML = `
                <div class="opciones">
                    <button class="pending">Pendientes</button>
                    <button class="acept">Aceptados</button>
                    <button class="on-path">En camino</button>
                    <button class="canceled">Cancelados</button>
                    <button class="confirmed">Confirmados</button>
                </div>
            `
            const table = document.createElement("table")
            table.className = "pedidos"
            table.innerHTML = `
                <tr>
                    <th>ID pedido</th>
                    <th>Fecha</th>
                    <th>Metodo de pago</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Ver Productos</th>
                    <th>Cancelar</th>
                </tr>
                `
            const car = await getPostCar(undefined,user._id)
            if (car) {
                car.forEach(carPedido => {
                    if (carPedido.id_pedido.state == "Aceptado") {
                        const pedido = carPedido.id_pedido
                        const tr = document.createElement("tr")
                        tr.innerHTML = `
                        <td>${pedido._id}</td>
                        <td>${pedido.date}</td>
                        <td>${pedido.payment_method}</td>
                        <td>${pedido.state}</td>
                        <td>${pedido.total}</td>
                        <td><button class="see-order">ver Productos</button></td>
                        <td><button class="delete-order">Cancelar</button></td>
                        `

                        table.appendChild(tr)
                    }
                })

                sectionOpciones.appendChild(table)

            }
        }else if(e.target.classList.contains("on-path")){
            sectionOpciones.innerHTML = `
                <div class="opciones">
                    <button class="pending">Pendientes</button>
                    <button class="acept">Aceptados</button>
                    <button class="on-path">En camino</button>
                    <button class="canceled">Cancelados</button>
                    <button class="confirmed">Confirmados</button>
                </div>
            `
            const table = document.createElement("table")
            table.className = "pedidos"
            table.innerHTML = `
                <tr>
                    <th>ID pedido</th>
                    <th>Fecha</th>
                    <th>Metodo de pago</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Ver Productos</th>
                    <th>Confirmar</th>
                    <th>Cancelar</th>
                </tr>
                `
            const car = await getPostCar(undefined,user._id)
            if (car) {
                car.forEach(carPedido => {
                    if (carPedido.id_pedido.state == "En Camino") {
                        const pedido = carPedido.id_pedido
                        const tr = document.createElement("tr")
                        tr.innerHTML = `
                        <td>${pedido._id}</td>
                        <td>${pedido.date}</td>
                        <td>${pedido.payment_method}</td>
                        <td>${pedido.state}</td>
                        <td>${pedido.total}</td>
                        <td><button class="see-order">ver Productos</button></td>
                        <td><button class="confirm-order">Confirmar</button></td>
                        <td><button class="delete-order">Cancelar</button></td>
                        `

                        table.appendChild(tr)
                    }
                })

                sectionOpciones.appendChild(table)

            }
        }else if(e.target.classList.contains("canceled")){
            sectionOpciones.innerHTML = `
                <div class="opciones">
                    <button class="pending">Pendientes</button>
                    <button class="acept">Aceptados</button>
                    <button class="on-path">En camino</button>
                    <button class="canceled">Cancelados</button>
                    <button class="confirmed">Confirmados</button>
                </div>
            `
            const table = document.createElement("table")
            table.className = "pedidos"
            table.innerHTML = `
                <tr>
                    <th>ID pedido</th>
                    <th>Fecha</th>
                    <th>Metodo de pago</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Ver Productos</th>
                </tr>
                `
            const car = await getPostCar(undefined,user._id)
            if (car) {
                car.forEach(carPedido => {
                    if (carPedido.id_pedido.state == "Cancelado") {
                        const pedido = carPedido.id_pedido
                        const tr = document.createElement("tr")
                        tr.innerHTML = `
                        <td>${pedido._id}</td>
                        <td>${pedido.date}</td>
                        <td>${pedido.payment_method}</td>
                        <td>${pedido.state}</td>
                        <td>${pedido.total}</td>
                        <td><button class="see-order">ver Productos</button></td>
                        `

                        table.appendChild(tr)
                    }
                })

                sectionOpciones.appendChild(table)

            }
        }else if(e.target.classList.contains("confirmed")){
            sectionOpciones.innerHTML = `
                <div class="opciones">
                    <button class="pending">Pendientes</button>
                    <button class="acept">Aceptados</button>
                    <button class="on-path">En camino</button>
                    <button class="canceled">Cancelados</button>
                    <button class="confirmed">Confirmados</button>
                </div>
            `
            const table = document.createElement("table")
            table.className = "pedidos"
            table.innerHTML = `
                <tr>
                    <th>ID pedido</th>
                    <th>Fecha</th>
                    <th>Metodo de pago</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Ver Productos</th>
                </tr>
                `
            const car = await getPostCar(undefined,user._id)
            if (car) {
                car.forEach(carPedido => {
                    if (carPedido.id_pedido.state == "Confirmado") {
                        const pedido = carPedido.id_pedido
                        const tr = document.createElement("tr")
                        tr.innerHTML = `
                        <td>${pedido._id}</td>
                        <td>${pedido.date}</td>
                        <td>${pedido.payment_method}</td>
                        <td>${pedido.state}</td>
                        <td>${pedido.total}</td>
                        <td><button class="see-order">ver Productos</button></td>
                        `

                        table.appendChild(tr)
                    }
                })
                sectionOpciones.appendChild(table)
            }
        }


        if(e.target.classList.contains("see-order")){
            console.log("He entrado")
            const idpedido = e.target.closest("tr").cells[0].innerText


            const car = await getPostCar(undefined,undefined,idpedido)
            const tablePro = document.createElement("table")
            tablePro.className = "productos"
            tablePro.innerHTML = `
            <tr>
                <th>ID Producto</th>
                <th>Categoria</th>
                <th>Nombre Producto</th>
                <th>Precio Producto</th>
                <th>Cantidad</th>
                <th>Total Producto</th>
            </tr>
            `
            const carPro = await getPostCarPro(car._id)
            console.log(carPro)
            const categorias = await getCategoria()
            carPro.forEach(carpro =>{
                const tr = document.createElement("tr")
                const idice = categorias.findIndex(cate =>{
                    return cate._id === carpro.id_producto.id_categoria
                })

                tr.innerHTML = `
                    <td>${carpro.id_producto._id}</td>
                    <td>${categorias[idice].name}</td>
                    <td>${carpro.id_producto.name}</td>
                    <td>${carpro.id_producto.price}</td>
                    <td>${carpro.amount}</td>
                    <td>${carpro.amount*carpro.id_producto.price}</td>
                `

                tablePro.appendChild(tr)
                // console.log(carpro)
                // console.log(categorias[idice].name)
            })

            sectionOpciones.appendChild(tablePro)
        }else if(e.target.classList.contains("delete-order")){
            const idpedido = e.target.closest("tr").cells[0].innerText

            const car = await getPostCar(undefined,undefined,idpedido)
            const upCar = await putCar(car._id, "Inactivo")
            const upPedido = await putPedido(car.id_pedido._id,car.id_pedido.total,car.id_pedido.payment_method,"Cancelado")

            if(upCar && upPedido){
                alert("Pedido Cancelado Correctamente")
            }
        }else if(e.target.classList.contains("confirm-order")){


        }
    }
})