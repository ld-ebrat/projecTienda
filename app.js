const express = require("express")
const app = express()
const crud = require("./crud/crud")
const path = require("path")
const bodyParse = require("body-parser")
const {conexionDB} = require("./conexion")
const fs = require("fs").promises

app.use(express.json())

conexionDB()
app.use(express.static("./public"))
app.use(crud)
app.use(bodyParse.json({limit: "1mb"}))

app.get("/", async (req, res) => {
    res.sendFile(path.resolve(__dirname + "/gestion.html"))
})

app.post("/save-img", async (req,res)=>{

    try{
        const base64 = req.body.data
        const bufer = Buffer.from(base64, "base64")
        await fs.writeFile("../imagenes-prueba/imagen.jpg", bufer)
        console.log("Imagen guardado correctamente")
        res.json({mensaje:"Imagen guardad correctamente"})
    }catch(err){
        console.log("Error al guardar la imagen", err)
        res.status(500).json({error:"Error al guardar la imagen"})
    }
    console.log(req.body)
})

app.listen(3000, () => {
    console.log("Servidor a la espera de conexiones")
})



"Ebrat182529"
