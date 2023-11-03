const expres = require("express")
const app = expres.Router()
const schemas = require("./schemas")
const jwt = require('jsonwebtoken');
const { Console } = require("console");
const fs = require("fs").promises

/*##################### Create ############################### */

async function auth(req, res, next) {
    try {
        let token = req.headers['authorization'];
        let resultadoToken = jwt.verify(token, '@Ebrat182529');

        let usuario = await schemas.Usuario.findOne({ _id: resultadoToken.id }).select("-password");

        req.user = usuario;

        next();
    } catch (err) {
        console.log("Error al realizar la autenticacion")
    }
}
app.get("/read-infoUser", auth, async (req, res) => {
    if (req.user) {
        const user = req.user
        res.status(200).json(user)
    } else {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

app.post("/save-img", async (req, res) => {
    try {
        const base64 = req.body.data
        const nameImg = req.body.nameImg
        const bufer = Buffer.from(base64, "base64")
        await fs.writeFile(`public/imgProductos/${nameImg}`, bufer)
        res.json({ mensaje: "Imagen guardad correctamente", imgRuta: `/imgProductos/${nameImg}` })
    } catch (err) {
        console.log("Error al guardar la imagen", err)
        res.status(500).json({ error: err })
    }
})
app.post("/user/login", async (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    try {
        const user = await schemas.Usuario.findOne({ email: email, password: pass })
        const token = jwt.sign({ id: user._id }, "@Ebrat182529", { expiresIn: '180000s' })
        res.status(200).json({ token })
    }catch(err) {
        res.status(500).json(err)
    }
})
app.post("/create-city", async (req, res) => {
    const nomCity = req.body.cityName
    try {
        const newCity = new schemas.City({ name: nomCity });
        await newCity.save();
        res.status(200).json(newCity)
    } catch (err) {
        console.log("Error al crear el nueva Ciudad: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})
app.post("/create-user", async (req, res) => {
    const city = req.body.city;
    const nom = req.body.name;
    const addres = req.body.addres;
    const state = req.body.state;
    const email = req.body.email;
    const pass = req.body.pass
    const imgProfile = req.body.imgSelect
    try {
        const newUser = new schemas.Usuario({
            id_city: city,
            imgUser: imgProfile,
            name: nom,
            address: addres,
            states: state,
            password: pass,
            email: email,
        })
        await newUser.save()

        const token = await jwt.sign({ id: newUser._id }, "@Ebrat182529", { expiresIn: '180000s' })
        res.status(200).json({ user: newUser, token: token })
    } catch (err) {
        if (err.code == 11000) {
            res.status(500).json(err)
        } else {
            console.log("Error al crear el nuevo Usuario: ", err);
            res.status(500).json({ err: "Error interno del servidor" });
        }
    }
})
app.post("/create-pedido", async (req, res) => {

    const date = req.body.date
    const metodoPago = req.body.metodoPago
    const state = req.body.state
    const total = req.body.total
    try {
        const newPedido = new schemas.Pedido({
            date: date,
            payment_method: metodoPago,
            state: state,
            total: total
        })

        await newPedido.save()
        res.status(200).json(newPedido)
    } catch (err) {
        console.log("Error al crear al crear el pedido: ", err)
        res.status(500).json({ err: "Error interno del servidor" })
    }
})
app.post("/create-cate", async (req, res) => {
    const nom = req.body.nameCate;
    const des = req.body.descCate;
    const state = req.body.stateCate
    try {
        const newCategoria = new schemas.Categoria({ name: nom, description: des, state });
        await newCategoria.save();

        res.status(200).json(newCategoria)
    } catch (err) {
        console.log("Error al crear el nueva Categoria: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})
app.get("/read-cate", async (req, res) => {
    try {
        const cate = await schemas.Categoria.find()
        res.status(200).json(cate)
    } catch (error) {
        console.log("Error al leer las categorias -> ", err)
        res.status(500).json({ mensaje: "Error al leer las categorias" })
    }
})
app.post("/create-pro", async (req, res) => {
    const nom = req.body.name
    const cate = req.body.cate
    const price = req.body.precio
    const rutaImg = req.body.rutaImg
    const desc = req.body.descPro
    try {
        const newProducto = new schemas.Producto({
            id_categoria: cate,
            imagen: rutaImg,
            description: desc,
            name: nom,
            price: price
        });
        await newProducto.save();
        res.status(200).json(newProducto)
    } catch (err) {
        console.log("Error al crear el nuevo Producto: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})
app.post("/read-pro", async (req, res) => {
    const idPro = req.body.idPro
    try {

        const pro = await schemas.Producto.findOne({ _id: idPro })
        res.status(200).json(pro)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})
app.get("/read-pro", async (req, res) => {
    try {
        const pro = await schemas.Producto.find()
        // await Producto.find().populate("id_categoria")
        res.status(200).json(pro)
    } catch (error) {
        res.status(500).json({ mensaje: "Error al leer los productos" })
    }
})
app.get("/read-city", async (req, res) => {
    try {
        const city = await schemas.City.find()
        res.status(200).json(city)
    } catch (error) {
        res.status(500).json({ mensaje: "Error al leer las ciudades" })
    }
})
app.post("/read-car", async (req, res) => {
    if (req.body.idUser) {
        try {
            const idUser = req.body.idUser
            const car = await schemas.Carrito.findOne({ id_usuario: idUser, state: "Activo" })
                .populate("id_pedido")

            res.status(200).json(car)
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err })
        }
    } else if (req.body.allCarUser) {
        try {
            const allCarUser = req.body.allCarUser
            const car = await schemas.Carrito.find({ id_usuario: allCarUser })
                .populate("id_pedido")

            res.status(200).json(car)
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err })
        }
    } else if (req.body.idPedido) {

        try {
            const idPedido = req.body.idPedido
            const car = await schemas.Carrito.findOne({id_pedido:idPedido })
            .populate("id_pedido")
            res.status(200).json(car)
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err })
        }
    }
})
app.get("/read-car", async (req, res) => {
    try {
        const car = await schemas.Carrito.find().populate("id_pedido")
        res.status(200).json(car)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})
app.post("/read-user", async (req,res)=>{
    const userNot = req.body.user
    try{
        const user = await schemas.Usuario.find({_id:{$ne: userNot}}).populate("id_city")
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({error:err})
    }
})
app.post("/read-carPro", async (req, res) => {
    const idCar = req.body.idCar
    try {
        const carPro = await schemas.Car_Pro.find({ id_carrito: idCar })
            .populate("id_producto")
        res.status(200).json(carPro)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})
app.get("/read-carPro", async (req, res) => {
    try {
        const carPro = await schemas.Car_Pro.find()
        res.status(200).json(carPro)
    } catch (err) {
        res.status(500).json()
    }
})
app.post("/read-pedido", async (req, res) => {
    const idPedido = req.body.idPedido

    if (!req.body.state) {
        try {
            const pedido = await schemas.Pedido.findOne({ _id: idPedido })
            res.status(200).json(pedido)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    } else {
        const state = req.body.state
        try {
            const pedido = await schemas.Pedido.find({ _id: idPedido, state: state })
            res.status(200).json(pedido)
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
})
app.get("/read-pedido", async (req,res)=>{
    try{
        const pedido = await schemas.Pedido.find()
        res.status(200).json(pedido)
    }catch(err){
        res.status(500).json({error:err})
    }
})
app.put("/update-carPro", async (req, res) => {
    const idCarPro = req.body.idCarPro
    const amoutUpdate = req.body.amoutUpdate
    try {
        const carPro = await schemas.Car_Pro.findOneAndUpdate(
            { _id: idCarPro },
            { $set: { amount: amoutUpdate } },
            { new: true }
        )
        if (carPro) {
            res.status(200).json(carPro)
        }
    } catch (err) {
        res.status(500).json({ error: err })
    }
})
app.put("/update-pedido", async (req, res) => {
    const idPedido = req.body.idPedido
    const total = req.body.total
    const date = req.body.date
    const metodo = req.body.metodo
    const state = req.body.state
    try {
        const pedido = await schemas.Pedido.findOneAndUpdate(
            { _id: idPedido },
            {
                $set: {
                    date: date,
                    payment_method: metodo,
                    state: state,
                    total: total
                }
            },
            { new: true }
        )
        if (pedido) {
            res.status(200).json(pedido)
        }
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})
app.put("/update-car", async (req, res) => {
    try {
        const idCar = req.body.idCar
        const state = req.body.state

        const car = await schemas.Carrito.findOneAndUpdate(
            { _id: idCar },
            { $set: { state: state } },
            { new: true }
        )

        if (car) {
            res.status(200).json(car)
        }
    } catch (err) {
        res.status(500).json({ error: err })
    }
})
app.put("/update-user", async (req, res) => {

    try {
        const idUser = req.body.idUser
        const nom = req.body.name;
        const email = req.body.email
        const direct = req.body.direc
        const city = req.body.city

        const user = await schemas.Usuario.findOneAndUpdate(
            { _id: idUser },
            {
                $set: {
                    name: nom,
                    email: email,
                    address: direct,
                    id_city: city
                }
            },
            { new: true }
        )

        if (user) {
            res.status(200).json(user)
        }
    } catch (err) {
        res.status(500).json({ error: err })
    }

})
app.post("/create-car", async (req, res) => {
    const idPedido = req.body.idPedido
    const idUsuario = req.body.idUser
    const state = req.body.state
    try {
        const newCarrito = new schemas.Carrito({
            id_pedido: idPedido,
            id_usuario: idUsuario,
            state, state
        })
        await newCarrito.save();
        res.status(200).json(newCarrito);
    } catch (err) {
        console.log("Error al crear el nuevo Carrito: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})
app.post("/create-carpro", async (req, res) => {
    const idCar = req.body.idCar
    const amount = req.body.amount
    const idPro = req.body.idPro
    try {
        const newCarPro = new schemas.Car_Pro({
            id_carrito: idCar,
            id_producto: idPro,
            amount: amount
        })
        await newCarPro.save();
        res.status(200).json(newCarPro);
    } catch (err) {
        console.log("Error al crear el nuevo Carrito-Producto: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})
app.delete("/delete-user", async (req, res)=>{
    const idUser = req.body.idUser
    try{
        const user = await schemas.Usuario.findOneAndDelete({_id: idUser})
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({error:err})
    }
})












app.post("/create-pedido", async (req, res) => {
    try {
        const newPedido = new Pedido(req.body);
        await newPedido.save();
        res.status(200).json(newPedido);
    } catch (err) {
        console.log("Error al crear el nuevo Pedido: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})

app.post("/create-oferta", async (req, res) => {
    try {
        const newOferta = new Oferta(req.body);
        await newOferta.save();
        res.status(200).json(newOferta)
    } catch (err) {
        console.log("Error al crear el nueva Oferta: ", err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
})

/*#########################################################################3 */

/*#################################### READ ############################### */



module.exports = app