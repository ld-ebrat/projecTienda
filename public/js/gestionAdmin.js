import { getUser, getAllUser, getPostPedido, deleteUser, getCar, putPedido } from "./peticiones.js"
const usuarios = document.getElementById("usuarios")
const carrito = document.getElementById("Carritos")
const pedido = document.getElementById("Pedidos")
const pedConf = document.getElementById("Confirm")
const pedWait = document.getElementById("wait")
const pedAcept = document.getElementById("Acepted")
const pedCancel = document.getElementById("Canceled")
const pedOnPath = document.getElementById("on-path")
const home = document.querySelector(".home")

home.addEventListener("click", () => {
    window.location.href = "/"
})

usuarios.addEventListener("click", async (e) => {

    if (e.target.classList.contains("dalete-user")) {
        const idUser = e.target.closest("tr").cells[0].innerText
        const delUser = await deleteUser(idUser)

        if (delUser) {
            alert("Usuario Eliminado Correctamente")
            window.location.href = "/html/gestionAdmin.html"
        }
    }
})

pedido.addEventListener("click", async (e) => {

    if (e.target.classList.contains("send-ped")) {
        const idPedido = e.target.closest("tr").cells[0].innerText

        const pedido = await getPostPedido(idPedido)
        console.log(pedido)
        const upPedido = await putPedido(pedido._id,pedido.total,pedido.payment_method,"En Camino")
        
        if(upPedido){
            window.location.href = "/html/gestionAdmin.html"
        }
    }
    console.log(e.target)
})
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token")
    const tableUsuario = document.createElement("table")
    const tablePedidoConfi = document.createElement("table")
    const tablePedidoCancel = document.createElement("table")
    const tablePedidoWait = document.createElement("table")
    const tablePedidoOnPath = document.createElement("table")
    const tablePedidoAcept = document.createElement("table")

    const userToken = await getUser(token)
    //############## Usuario ###################3
    tableUsuario.className = "table-Usuarios"

    tableUsuario.innerHTML = `
    <tr>
        <th>ID Usuario</th>
        <th>Nombre</th>
        <th>Ciudad</th>
        <th>Direccion</th>
        <th>Correo</th>
        <th>Eliminar Usuario</th>
    <tr>
    `
    tablePedidoAcept.innerHTML = `
    <tr>
        <th>ID Pedido</th>
        <th>Fecha</th>
        <th>Metodo Pago</th>
        <th>State</th>
        <th>Total</th>
        <th>Enviar Pedido</th>
    </tr>
    `
    tablePedidoCancel.innerHTML = `
    <tr>
        <th>ID Pedido</th>
        <th>Fecha</th>
        <th>Metodo Pago</th>
        <th>State</th>
        <th>Total</th>
    </tr>
    `
    tablePedidoConfi.innerHTML = `
    <tr>
        <th>ID Pedido</th>
        <th>Fecha</th>
        <th>Metodo Pago</th>
        <th>State</th>
        <th>Total</th>
    </tr>
    `
    tablePedidoOnPath.innerHTML = `
    <tr>
        <th>ID Pedido</th>
        <th>Fecha</th>
        <th>Metodo Pago</th>
        <th>State</th>
        <th>Total</th>
    </tr>
    `
    tablePedidoWait.innerHTML = `
    <tr>
        <th>ID Pedido</th>
        <th>Fecha</th>
        <th>Metodo Pago</th>
        <th>State</th>
        <th>Total</th>
    </tr>
    `

    const User = await getAllUser(userToken._id)
    User.forEach(user => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${user._id}</td>
            <td>${user.name}</td>
            <td>${user.id_city.name}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td><button class="dalete-user">Eliminar</button></td>
            
        `
        tableUsuario.appendChild(tr)
    })
    usuarios.appendChild(tableUsuario)


    //################### Pedidos ##################

    const car = await getCar()
    car.forEach(car => {
        if (car.id_pedido.state == "Confirmado") {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${car.id_pedido._id}</td>
                <td>${car.id_pedido.date}</td>
                <td>${car.id_pedido.payment_method}</td>
                <td>${car.id_pedido.state}</td>
                <td>${car.id_pedido.total}</td>
            `
            tablePedidoConfi.appendChild(tr)
        } else if (car.id_pedido.state == "Cancelado") {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${car.id_pedido._id}</td>
                <td>${car.id_pedido.date}</td>
                <td>${car.id_pedido.payment_method}</td>
                <td>${car.id_pedido.state}</td>
                <td>${car.id_pedido.total}</td>
            `
            tablePedidoCancel.appendChild(tr)
        } else if (car.id_pedido.state == "En Espera") {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${car.id_pedido._id}</td>
                <td>${car.id_pedido.date}</td>
                <td>${car.id_pedido.payment_method}</td>
                <td>${car.id_pedido.state}</td>
                <td>${car.id_pedido.total}</td>
            `
            tablePedidoWait.appendChild(tr)
        } else if (car.id_pedido.state == "En Camino") {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${car.id_pedido._id}</td>
                <td>${car.id_pedido.date}</td>
                <td>${car.id_pedido.payment_method}</td>
                <td>${car.id_pedido.state}</td>
                <td>${car.id_pedido.total}</td>
            `
            tablePedidoOnPath.appendChild(tr)
        } else if (car.id_pedido.state == "Aceptado") {
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${car.id_pedido._id}</td>
                <td>${car.id_pedido.date}</td>
                <td>${car.id_pedido.payment_method}</td>
                <td>${car.id_pedido.state}</td>
                <td>${car.id_pedido.total}</td>
                <td><button class="send-ped">Envias Pedido</button></td>
            `
            tablePedidoAcept.appendChild(tr)
        }
    })

    pedAcept.appendChild(tablePedidoAcept)
    pedCancel.appendChild(tablePedidoCancel)
    pedConf.appendChild(tablePedidoConfi)
    pedOnPath.appendChild(tablePedidoOnPath)
    pedWait.appendChild(tablePedidoWait)

    // if(e.target.classList.contains("send-ped")){
    //     const idPedido = e.target.closest("tr").cells[0].innerText

    //     const indice = car.findIndex(carr =>{
    //         return carr.id_pedido._id === idPedido
    //     })
    //     const upPedido = await putPedido()

    // }

})