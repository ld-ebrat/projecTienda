const imgPro = document.getElementById("img-product")
const action = document.querySelector("#action")
const btnAction = document.querySelector(".btn-action")
const btnAddPro = document.querySelector(".btn-add-pro")
const btnAddCate = document.querySelector(".btn-add-categoria")
const catePro = document.querySelector("#select-caterogia")


// imgPro.addEventListener("change", (e)=>{
//     const reader = new FileReader()
//     reader.onloadend = async (e1)=>{
//         try{
//             const response = await fetch("/prueba-imagen",{
//                 method: "POST",
//                 headers:{
//                     "Content-Type":"application/json"
//                 },
//                 body: JSON.stringify({data:e1.target.result.split(",")[1]})
//             })
//         }catch(err){

//         }
//     }
//     reader.readAsDataURL(e.target.files[0])
// })

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const responseCatePro = await fetch("/read-cate")
        if (responseCatePro.ok) {
            const dataCatePro = await responseCatePro.json()

            catePro.innerHTML = `
                <option value="select-cate" selected>Seleccionar Categoria</option>
            `
            dataCatePro.forEach(cate => {
                const opt = document.createElement("option")
                opt.value = cate._id
                opt.innerText = cate.name

                catePro.appendChild(opt)
            })
        }
    } catch (err) {

    }
})

var rutaImg
btnAddPro.addEventListener("click", async () => {
    const name = document.querySelector("#name").value
    const precio = document.querySelector("#price").value
    const cate = catePro[catePro.selectedIndex].value
    const descPro = document.querySelector("#descripcion-product").value

    if (name != "" && precio != "" && cate != "select-cate" && imgPro.files.length != "0") {
        const reader = new FileReader()
        reader.onloadend = async (e1) => {
            const nameImg = imgPro.files[0].name
            const data = e1.target.result.split(",")[1]
            try{
                const responseImg = await fetch("/save-img",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({nameImg, data})
                })

                if(responseImg.ok){
                    const dataImg = await responseImg.json()
                    rutaImg = dataImg.imgRuta

                    try{
                        const responsePro = await fetch("/create-pro", {
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body: JSON.stringify({name, cate, precio, rutaImg, descPro})
                        })
            
                        if(responsePro.ok){
                            alert("Producto Guardado Correctamente")
                        }
                    }catch(err){
                        console.log("Error al guardar el producto -> ", err)
                    }
                }
            }catch(err){
                console.log("Error al guardar la imagen -> ", err)
            }
        }
        reader.readAsDataURL(imgPro.files[0])
    }else{

    }
})

btnAddCate.addEventListener("click", async (e) => {
    const nameCate = document.querySelector("#name-categoria").value
    const descCate = document.querySelector("#descripcion-categoria").value
    const stateCate = "Activo"
    if (nameCate.innerText != "" && descCate.innerText != "") {
        try {
            const responseAddCate = await fetch("/create-cate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nameCate, descCate, stateCate })
            })

            if (responseAddCate.ok) {
                alert("Categoria agregada Correctamente")
            }
        } catch (err) {

        }
    } else {
        alert("Faltan campos por llenar en la categoria")
    }
})