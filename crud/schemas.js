const mongoose = require("mongoose");

const Cities = new mongoose.Schema({
    name: String,
})
const Usuarios = new mongoose.Schema({
    id_city:{
        type:String,
        ref: "Cities"
    },
    imgUser: String,
    name: String,
    address: String,
    states: {
        type: String,
        enum: ["Activo","Inactivo"]
    },
    password: String,
    email: {
        type:String,
        unique: true
    },
});

const Pedidos = new mongoose.Schema({
    date: String,
    payment_method: String,
    state: {
        type:String,
        enum: ["Confirmado", "Cancelado","En Espera", "En Camino"]
    },
    total: Number
});

const Categorias = new mongoose.Schema({
    name: String,
    description: String,
    state: {
        type: String,
        enum: ["Activo", "Inactivo"],
    }
});

const Productos = new mongoose.Schema({
    id_categoria:{
        type: String,
        ref: "Categorias",
    },
    imagen: String,
    description: String,
    name: String,
    price: Number,
});

const Ofertas = new mongoose.Schema({
    id_producto:{
        type: String,
        ref:"Productos",
    },
    name: String,
    address: String,
    state: {
        type: String,
        enum: ["Activo", "Inactivo"]
    },
    start: Date,
    end: Date
});

const Carritos = new mongoose.Schema({
    id_usuario:{
        type: String,
        ref: "Usuarios",
    },
    id_pedido:{
        type: String,
        ref: "Pedidos",
    },
    state:{
        type: String,
        enum:["Activo","Inactivo"],
    },
});

const Carritos_Productos = new mongoose.Schema({
    id_producto:{
        type: String,
        ref:"Productos",
    },
    id_carrito:{
        type: String,
        ref: "Carritos",
    },
    amount:Number
});

const City = mongoose.model("Cities", Cities);
const Usuario = mongoose.model("Usuarios",Usuarios);
const Pedido = mongoose.model("Pedidos",Pedidos);
const Categoria = mongoose.model("Categorias",Categorias);
const Producto = mongoose.model("Productos",Productos);
const Oferta = mongoose.model("Ofertas",Ofertas);
const Carrito = mongoose.model("Carritos",Carritos);
const Car_Pro = mongoose.model("Car_Pro",Carritos_Productos)

module.exports = {
    City,
    Usuario,
    Pedido,
    Categoria,
    Producto,
    Oferta,
    Carrito,
    Car_Pro,
};