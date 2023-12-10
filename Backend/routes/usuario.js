import express from "express";
const router = express.Router();

// importar el modelo nota
import usuarioSchema from "../models/usuario";

router.post("/addUsuario", async (req, res) => {
  const body = req.body;

  const usuario = usuarioSchema(body);
  await usuario
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});
router.post("/addUsuarios", async (req, res) => {
  const usuarios = req.body.usuarios;
  const agregados = [];
  const malos = [];
  var result
  try {
    result = await usuarioSchema.insertMany(usuarios, {
      ordered: false,
    });
  } catch (error) {
    result = error;
  }
  console.log("Se han guardado las consultas");
  if (result.insertedDocs !== undefined) {
    result = result.insertedDocs;
    
  }
  res.json({ usuariosAgregados: result.length, usuariosMal: usuarios.length - result.length });

  
 
});

router.get("/getMedicos", async (req, res) => {
  await usuarioSchema
    .find({ rol: "Medico" }, "nombre rut")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getCajeros", async (req, res) => {
  await usuarioSchema
    .find({ rol: "Cajero" }, "nombre rut")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getTransaccionesCajeros/", async (req, res) => {
  const cajeros = req.query.cajeros;
  const trimestre = req.query.trimestre;
  const año = req.query.anio;
  const rutCajeros = [];
  const nombres = [];
  const conteos = [];
  if(Array.isArray(cajeros)){
    for (const element of cajeros) {
      rutCajeros.push(element.rut);
    }
  }
  else{
    rutCajeros.push(cajeros.rut);
  }
  
  await usuarioSchema
    .find({ rut: { $in: rutCajeros } })
    .populate({ path: "consultas", match: { trimestre: trimestre, año: año } })

    .then((result) => {
      for (const element of result) {
        nombres.push(element.nombre);
        conteos.push(element.consultas.length);
      }
      res.json({ nombres: nombres, conteos: conteos });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getMedicoPrevision/", async (req, res) => {
  console.log(req.query);
  
  const medicos = req.query.medicos;
  const mes = req.query.mes;
  const año = req.query.anio;
  const prevision = req.query.prevision;
  
  const rutMedicos = [];
  var nombres = [];
  var montos =[]
  if(Array.isArray(medicos)){
    for (const element of medicos) {
      rutMedicos.push(element.rut);
    }
  }
  else{
    rutMedicos.push(medicos.rut);
  }
  
  ;
  await usuarioSchema
    .find({ rut: { $in: rutMedicos } })
    .populate({
      path: "consultas",
      match: { mes: mes, año: año, prevision: prevision },
    })

    .then((result) => {
      montos   = new Array(result.length).fill(0);
      
      var count =0;
      for (const element of result) {

        nombres.push(element.nombre);
        for (const consulta of element.consultas) {
          montos[count] += consulta.monto;
        }
        count++;
      }
      
      

     
      res.json({ nombres: nombres, montos: montos }); 
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getConsultasMedico/:rut/:mes/:anio", async (req, res) => {
  console.log(req.params);
  const rut = req.params.rut;
  const mes = req.params.mes;
  const año = req.params.anio;

  const enviados = [];
  const sumaMontosPorDia = new Array(31).fill(0);
  const diasUnicos = new Array(31).fill(0);
  await usuarioSchema
    .findOne({ rut: rut })
    .populate({ path: "consultas", match: { mes: mes, año: año } })
    .exec()
    .then((result) => {
      const consultas = result.consultas;
      consultas.map((consulta) => {
        const dia = new Date(consulta.fecha).getDate();
        diasUnicos[dia] = dia + 1;
        sumaMontosPorDia[dia] += consulta.monto;
      });

      res.json({ dias: diasUnicos, sumaMontosPorDia: sumaMontosPorDia });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
