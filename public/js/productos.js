const mainConten = document.getElementById("main")
const btnCall = document.getElementById("boton-call-pro")

btnCall.addEventListener("click", ()=>{
    const produ = document.querySelectorAll(".product")

    produ.forEach(pro =>{
        pro.style.width = "250px"
    })
})
// btnCall.addEventListener("click", async ()=>{
//     try{
//         const response = await fetch("productos.html")
//         if(response.ok){
//             const data = await response.text()

//             const parse = new DOMParser()
//             const temp = parse.parseFromString(data, "text/html")
//             console.log(data)
//             const hr = document.createElement("hr")
//             hr.className = "soyhr"
//             temp.querySelector("#fil").appendChild(hr)
//             mainConten.innerHTML = temp.body.innerHTML
//         }
//     }catch(error){
//     }
// })

const divsMenus= document.querySelectorAll(".menus-filtro")
// const fil = document.getElementById("fil")
// fil.addEventListener("click", (e)=>{
//     console.log(e.target)
//     console.log(this)
// })

divsMenus.forEach(div =>{

    div.addEventListener("click", (e)=>{
        console.log(e.target.nextSibling)
        console.log(e.target)
    })
})
