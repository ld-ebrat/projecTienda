import { getUser, getPro, getPostCar, getPostCarPro, getPostPedido, postPedido, postCar, putCarPro, postCarPro, putPedido } from "./peticiones.js"
const containerProd = document.querySelector('.container-prod')

//############ Elementos ############

//############ Variables ############
let productos = {}
var contPro = 0
//############ Variables ############

document.addEventListener('DOMContentLoaded', async () => {
  containerProd.innerHTML = `
    `
  const product = await getPro()
  product.forEach(pro => {
    const divPro = document.createElement('div')
    divPro.className = 'product'
    divPro.setAttribute('data-id', `${pro._id}`)
    divPro.innerHTML = `
                <div class="img-pro">
                        <img src="${pro.imagen}" alt="">
                </div>
                <div class="info-pro">
                    <div>
                        <h4>${pro.name}</h4>
                        <span>${pro.price}</span>
                    </div>
                    <div>
                        <button class="add-carrito">Add Car</button>
                    </div>
                </div>
                `
    containerProd.appendChild(divPro)
  })
})

const product = document.querySelectorAll('.product')

containerProd.addEventListener('click', async e => {
  const token = localStorage.getItem('token')
  var producto
  var producto2
  if (e.target.classList.contains('add-carrito')) {
    const pro = e.target.closest('.product')
    const idPro = pro.getAttribute('data-id')
    if (token) {

      const user = await getUser(token)
      const car = await getPostCar(user._id)
      if (!car) {

        const pedido = await postPedido(Number(pro.querySelector("span").innerText))
        const carCre = await postCar(user._id, pedido._id)
        const carPro = await postCarPro(carCre._id, pro.getAttribute("data-id"))
      } else {
        const carPro = await getPostCarPro(car._id)
        if (carPro.find(carPro => carPro.id_producto._id == idPro)) {
          carPro.forEach(async carpro => {
            if (carpro.id_producto._id == idPro) {
              const updateCarPro = await putCarPro(carpro._id, carpro.amount + 1)
              const upPedido = await putPedido(car.id_pedido._id, car.id_pedido.total + Number(pro.querySelector("span").innerText))
            }
          })
        } else {
          const carPro = await postCarPro(car._id, pro.getAttribute("data-id"))
          const upPedido = await putPedido(car.id_pedido._id, car.id_pedido.total + Number(pro.querySelector("span").innerText))
        }
      }
    }
  }
})