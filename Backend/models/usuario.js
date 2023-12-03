import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
    rut: {type:String,unique:true},
    rol:String,
    consultas: [{ type: Schema.Types.ObjectId, ref: 'consulta' }]
},{ versionKey: false }
);

const usuario = mongoose.model('usuario', usuarioSchema);

export default usuario;