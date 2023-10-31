const containerProd = document.querySelector('.container-prod')

//############ Elementos ############

//############ Variables ############
let productos = {}
var contPro = 0
//############ Variables ############

document.addEventListener('DOMContentLoaded', async () => {
  containerProd.innerHTML = `
    `
  try {
    const responseProduct = await fetch('/read-pro')

    if (responseProduct.ok) {
      const dataProduct = await responseProduct.json()
      dataProduct.forEach(pro => {
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
    }
  } catch (err) {
    console.log('Error al leer los productos -> ', err)
  }
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
      const idUsuario = await getUser(token)

      const responseCar = await getPostCar(idUsuario)
      if (!responseCar) {

        const idPedido = await postPedido()
        const idCar = (await postCar(idUsuario, idPedido._id))._id

        const idCarPro = await postCarPro(idCar, pro.getAttribute('data-id'))
        const upPedido = await putPedido(idPedido._id, (Number(pro.querySelector("span").innerText)*idCarPro.amount))

      } else {
        const idCar = responseCar._id

        const dataCarPro = await getPostCarPro(idCar)

        if (dataCarPro.find(carPro => carPro.id_producto == idPro)) {
          dataCarPro.forEach(async carPro => {
            if (carPro.id_producto == idPro) {
              const dataUndateCarPro = await putCarPro(
                carPro._id,
                carPro.amount + 1
              )
              const less = (dataUndateCarPro.amount-1)*Number(pro.querySelector("span").innerText)
              const totalUpdate = dataUndateCarPro.amount*Number(pro.querySelector("span").innerText)
              const pedido = await getPostPedido(responseCar.id_pedido)
              const upPedido = await putPedido(responseCar.id_pedido, totalUpdate, less, pedido.total)
            }
          })
        } else {
          const carPro = await postCarPro(idCar, pro.getAttribute('data-id'))
          const totalAmout = Number(pro.querySelector("span").innerText)
          const pedido = await getPostPedido(responseCar.id_pedido)
          const upPedido = await putPedido(responseCar.id_pedido, totalAmout,0,pedido.total)
        }
      }
    }
  }
})

async function getPostCar (idUser) {
  try {
    const response = await fetch('/read-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idUser })
    })

    if (response.ok) {
      const data = response.json()
      return data
    } else {
      console.log(response.status)
    }
  } catch (err) {
    console.log('Error en el fetch de leer car -> ', err)
  }
}
async function getPostCarPro (idCar) {
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
    } else {
      console.log(response.status)
    }
  } catch (err) {
    console.log('Error al ahcer el fetch en getCarPro -> ', err)
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

  }
}
async function putCarPro (idCarPro, amoutUpdate) {
  try {
    const response = await fetch('/update-carPro', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idCarPro, amoutUpdate })
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
    }
  } catch (err) {
    console.log('Error al hacer el fetch putCarPro -> ', err)
  }
}
async function postPedido () {
  const date = new Date().toLocaleString()
  const metodoPago = ''
  const state = 'En Espera'
  const total = 0
  try {
    const response = await fetch('create-pedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, metodoPago, state, total })
    })
    if (response.ok) {
      const data = response.json()
      return data
    } else {
      console.log(response.status)
    }
  } catch (err) {
    console.log(err)
  }
}
async function putPedido(idPedido, totalUpdate, less = 0, totalPedi = 0){
  try{
    const response = await fetch("/update-pedido",{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({idPedido, totalUpdate, less, totalPedi})
    })

    if(response.ok){
      const data = await response.json()
      return data
    }else{
      console.log(response.status)
    }
  }catch(err){
    console.log("Error al realizar el fetch de putPedido -> ",err)
  }
}
async function getUser (token) {
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
      return data._id
    } else {
      console.log(response.status)
    }
  } catch (err) {
    console.log('Error al hacer el fetch en getUsuario -> ', err)
  }
}
async function postCar (idUser, idPedido) {
  const state = 'Activo'
  try {
    const response = await fetch('/create-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idPedido, idUser, state })
    })

    if (response.ok) {
      const data = response.json()
      return data
    } else {
      console.log(response.status)
    }
  } catch (err) {
    console.log('Erro en el fetch de car -> ', err)
  }
}
async function postCarPro (idCar, idPro, amountPro = 1) {
  const amount = amountPro
  try {
    const response = await fetch('/create-carpro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idCar, idPro, amount })
    })

    if (response.ok) {
      const data = response.json()
      return data
    }
  } catch (err) {
    console.log('Error en el fetch de carPro -> ', err)
  }
}

const btnAddCate = document.getElementById('add-cate')
const btnAddCity = document.getElementById('add-city')
const btnAddUser = document.getElementById('add-user')
const btnAddPro = document.getElementById('add-pro')
const btnaddBuy = document.getElementById('pro-table')
const btntableBuy = document.getElementById('table-carrito')

const imgPro = document.getElementById('img-product')

// imgPro.addEventListener("change", (e) => {

//     const reader = new FileReader()
//     reader.onloadend = async () => {
//         try {
//             const response = await fetch("/prueba-imagen", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({data: Array.from(new Uint8Array(reader.result))})
//             })
//         } catch (err) {

//         }
//         console.log(reader.result)
//     }
//     reader.readAsArrayBuffer(e.target.files[0])
//     // try{
//     //     const response = await fetch("/prueba-imagen", {
//     //         method: "POST",
//     //         headers:{
//     //             "Content-Type":"application/json"
//     //         },
//     //         body: JSON.stringify(respuesta)
//     //     })
//     // }catch(err){
//     //     console.log(err)
//     // }
// })
// const btnUp = document.getElementById("upFile")
// const imagen1 = document.getElementById("img")

// btnUp.addEventListener("change", (e)=>{

//     if(e.target.files[0]){
//         const render = new FileReader();
//         render.onloadend = (e1)=>{
//             console.log(e1.target.result)
//             imagen1.src = e1.target.result
//         }

//         render.readAsDataURL(e.target.files[0]);
//     }else{
//         console.log("Entre mas bien aqui")
//     }
// })

//Obtener datos al cargar la pagina
// document.addEventListener("DOMContentLoaded", async () => {
//     const cityUser = document.getElementById("city-user")
//     const catePro = document.getElementById("cate-pro")
//     const tablePro = document.getElementById("pro-table")

//     try {
//         const responseCity = await fetch("/read-city")

//         if (responseCity.ok) {
//             const dataCity = await responseCity.json()

//             cityUser.innerHTML = `<option value="Select" selected>Select City</option>`
//             dataCity.forEach(city => {
//                 const optionCity = document.createElement("option")
//                 optionCity.value = city._id
//                 optionCity.innerText = city.name

//                 cityUser.appendChild(optionCity)
//             })
//         } else {
//             console.log("Error al leer las ciudades Aqui en el else")
//         }
//     } catch (error) {
//         console.log(error + "Error al leer las ciudades Aqui en el catch")
//     }

//     try {
//         const responseCate = await fetch("/read-cate")

//         if (responseCate.ok) {
//             const dataCate = await responseCate.json()
//             catePro.innerHTML = `<option value="Select" selected>Select Categoria</option>`
//             dataCate.forEach(cate => {
//                 const optionCate = document.createElement("option")
//                 optionCate.value = cate._id
//                 optionCate.innerText = cate.name

//                 catePro.appendChild(optionCate)
//             })
//         } else {
//             console.log("Error al leer las categorias Aqui en el else")
//         }
//     } catch (error) {
//         console.log(error + "Error al leer las categorias")
//     }

//     try {
//         const responsePro = await fetch("/read-pro")

//         if (responsePro.ok) {
//             const dataPro = await responsePro.json()
//             tablePro.innerHTML = `
//                 <tr>
//                     <th>Id</th>
//                     <th>Categoria</th>
//                     <th>Producto</th>
//                     <th>Precio</th>
//                     <th>stock</th>
//                     <th>Add Buy</th>
//                 </tr>
//             `

//             dataPro.forEach(pro => {
//                 const row = document.createElement("tr")
//                 console.log(pro)
//                 row.innerHTML = `
//                     <th>${pro._id}</th>
//                     <th>${pro.id_categoria.name}</th>
//                     <th>${pro.name}</th>
//                     <th>${pro.price}</th>
//                     <th>${pro.stock}</th>
//                     <th><button class="btnAddBuy">add</button></th>

//                 `

//                 tablePro.appendChild(row)
//             })
//         } else {
//             console.log("Error al obtener los productos en el else")
//         }
//     } catch (error) {
//         console.log(error + " Error al obtener los productos enel catch")
//     }
// })

// btntableBuy.addEventListener("click", (e) => {
//     const elementClick = e.target
//     const row = elementClick.closest("tr")
//     const cant = row.cells[5].childNodes[1]

//     if (elementClick.classList.contains("lessCant")) {
//         if (Number(cant.textContent) > 0) {
//             cant.textContent = `${Number(cant.textContent) - 1}`
//         }
//     } else {
//         if (elementClick.classList.contains("moreCant")) {
//             cant.textContent = `${Number(cant.textContent) + 1}`
//         }
//     }
// })

// btnaddBuy.addEventListener("click", (e) => {
//     const elementoClickeado = e.target
//     const tabCar = document.getElementById("table-carrito")

//     if (elementoClickeado.classList.contains("btnAddBuy")) {
//         const row = elementoClickeado.closest("tr")
//         const row2 = document.createElement("tr")

//         row2.innerHTML = `
//             <th>${row.cells[0].innerText}</th>
//             <th>${row.cells[1].innerText}</th>
//             <th>${row.cells[2].innerText}</th>
//             <th>${row.cells[3].innerText}</th>
//             <th>${row.cells[4].innerText}</th>
//             <th><button class="lessCant">-</button>0<button class="moreCant">+</button></th>
//             <th><button>Del Buy</button></th>
//         `
//         const val = () => {
//             if (tabCar.childElementCount == 1) {
//                 tabCar.appendChild(row2)
//             } else {
//                 for (let i = 1; i < tabCar.childElementCount; i++) {
//                     if (tabCar.rows[i].cells[0].innerText == row.cells[0].innerText) {
//                         return true
//                     }
//                 }
//                 return false
//             }
//         }

//         if (!val()) {
//             tabCar.appendChild(row2)
//         }
//     }
//     // console.log(elementoClickeado.classList)
//     // console.log(elementoClickeado.getAttribute('data-fila'))
//     // console.log(elementoClickeado.closest("tr"))
// })

// btnAddCate.addEventListener("click", async () => {
//     const nom = document.getElementById("nom-cate").value
//     const des = document.getElementById("desc-cate").value
//     const state = document.getElementById("state-cate").value
//     try {
//         const response = await fetch('/create-cate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ nom, des, state })
//         })

//         if (response.ok) {
//             const data = await response.json()
//             console.log("Categoria Creada Correctamente")
//         } else {
//             console.log(response.status + "Aqui en el else")
//         }
//     } catch (error) {
//         console.log(error + "Aqui en el catch")
//     }
// })

// btnAddCity.addEventListener("click", async () => {
//     const nomCity = document.getElementById("nom-city").value

//     if (nomCity == "") {
//         alert("Digite el nombre de la ciudad")
//     } else {
//         try {
//             const response = await fetch("/create-city", {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ nomCity })
//             })
//             if (response.ok) {
//                 const data = await response.json()
//                 console.log(data.message)
//             } else {
//                 console.log(response.status)
//             }
//         } catch (error) {
//             console.log(error)
//         }

//     }
// })

// btnAddUser.addEventListener("click", async () => {
//     const nom = document.getElementById("nom-user").value;
//     const city = document.getElementById("city-user").value;
//     const address = document.getElementById("addr-user").value;
//     const state = document.getElementById("state-user").value;
//     const phone = document.getElementById("phone").value;
//     const email = document.getElementById("email").value;
//     const pass = document.getElementById("pass").value
//     try {
//         const response = await fetch("/create-user", {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ nom, city, address, state, phone, email, pass })
//         })

//         if (response.ok) {
//             const data = response.json()
//             console.log("Usuario agregado Correctamente")
//         } else {
//             console.log(response.status + "Aqui en el else")
//         }
//     } catch (error) {
//         console.log(error + " Aqui en el catch")
//     }
// })

// btnAddPro.addEventListener("click", async () => {
//     const cate = document.getElementById("cate-pro").value
//     const nom = document.getElementById("nom-pro").value
//     const price = document.getElementById("price-pro").value
//     const stock = Number(document.getElementById("stock-pro").value)

//     try {
//         const response = await fetch("/create-pro", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ cate, nom, price, stock })
//         })

//         if (response.ok) {
//             const data = await response.json()
//             console.log("Producto agregado Correctamente")
//         } else {
//             console.log(response.status + " Aqui en el else")
//         }
//     } catch (error) {
//         console.log(error + "Error  al agregar producto")
//     }
// })

// btnGetCate.addEventListener("click", async () => {
//     const tableCate = document.getElementById("cate-table")
//     try {
//         const response = await fetch("/read-cate")
//         if (response.ok) {
//             const data = await response.json()
//             tableCate.innerHTML = `
//             <tr>
//                 <th>Id</th>
//                 <th>Name</th>
//                 <th>Description</th>
//                 <th>State</th>
//                 <th>Buton</th>
//             </tr>
//             `
// data.forEach(cat => {
//     const row = document.createElement("tr")
//     row.innerHTML = `
//         <td>${cat._id}</td>
//         <td>${cat.name}</td>
//         <td>${cat.description}</td>
//         <td>${cat.state}</td>
//         <td><button>ADD</button></td>
//     `
//     console.log(row)
//     tableCate.appendChild(row)
// });
//         } else {
//             console.log("Error al leer las categorias")
//         }
//     } catch (error) {
//         console.log(error + " Error al leer las Categorias aqui en el catch")
//     }
// })

// document.addEventListener("DOMContentLoaded", async ()=>{
//     const proTable = document.getElementById("pro-table")
//     try{
//         const response = await fetch("/read-pro")
//         if(response.ok){
//             const data = await response.json()
//             data.forEach((producto) => {
//                 const row = document.createElement("tr")
//                 row.innerHTML = `
//                     <th>${producto._id}</th>
//                     <th>${producto.id_categoria}</th>
//                     <th>${producto.name}</th>
//                     <th>${producto.price}</th>
//                     <th>${producto.stock}</th>
//                     <th><button>add</button></th>
//                 `;
//                 proTable.appendChild(row)
//             });
//         }
//     }catch(error){
//         console.error(error.message)
//     }
// })
