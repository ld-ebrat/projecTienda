const mongoose = require("mongoose");

const pass = "Ebrat182529"
const uri = `mongodb+srv://ebratld:${pass}@cluster0.umdc50x.mongodb.net/?retryWrites=true&w=majority`

const conexionDB = async () => {
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("conexion realizada")
  } catch (error) {
    console.log(error+ " Error a la hora de iniciar la BD ver logs");
  }
};

module.exports = {
  conexionDB,
};