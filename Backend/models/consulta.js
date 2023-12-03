import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const consultaSchema = new Schema({
    id: { type: Number, required: true,unique:true },
    usuario: { type: String, required: true },
    fecha:{ type: Date, required: true },
    hora:{ type: String, required: true },
    fechahora: { type: Date, required: true },
    tipoconsulta:{ type: String, required: true },
    rutmedico:{ type: String, required: true },
    prevision:{ type: String, required: true },
    pagacon:{ type: String, required: true },
    monto: { type: Number, required: true },
    mes:{ type: String, required: true },
    año:{ type: Number, required: true },
    semestre:{ type: Number, required: true },
    trimestre:{ type: Number, required: true },
    
    

},{ versionKey: false ,timestamps: false}
);

const consulta = mongoose.model('consulta', consultaSchema);

export default consulta;