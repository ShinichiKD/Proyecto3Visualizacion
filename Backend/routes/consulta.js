import express from "express";
const router = express.Router();

// importar el modelo nota
import consultaSchema from "../models/consulta";
import usuarioSchema from "../models/usuario";

router.post("/addConsultas", async (req, res) => {
  const consultas = req.body.consultas;
  const agregadas = [];
  var result = null;
  // Insertar consultas
  try {
    result = await consultaSchema.insertMany(consultas, {
      ordered: false,
    });
  } catch (error) {
    result = error;
  }
  console.log("Se han guardado las consultas");
  if (result.insertedDocs !== undefined) {
    result = result.insertedDocs;
  } 
  try {
    console.log("Se inicia flatMap")
    const bulkOps = result.flatMap(element => ([
      {
        updateOne: {
          filter: { rut: element.rutmedico },
          update: { $push: { consultas: element._id } },
        }
      },
      {
        updateOne: {
          filter: { rut: element.usuario },
          update: { $push: { consultas: element._id } },
        }
      }
    ]));
    console.log("Se inicia bulkWrite")
    await usuarioSchema.bulkWrite(bulkOps)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
    console.log("Se termina bulkWrite")
   
    res.json({ agregadas: result.length, malas: consultas.length - result.length });
  } catch (error) {
    res.json({ agregadas:0, malas: 0 });
  }
});


router.get("/getConsultas", async (req, res) => {
  await consultaSchema
    .find()
    .then((result) => {
      
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getConsultasAnios", async (req, res) => {
  var años = [];
  var conteos = [];

  await consultaSchema
    .aggregate([
      {
        $group: {
          _id: "$año",
          total: { $sum: 1 },
        },
      },
    ])
    .then((result) => {
      result.forEach((element) => {
        años.push(element._id);
        conteos.push(element.total);
      });

      res.json({ años: años, conteos: conteos });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getConsultasMesesAnio/:anio", async (req, res) => {
  console.log(req.params.anio);
  const año = req.params.anio;
  var conteos = [];
  await consultaSchema
    .aggregate([
      {
        $match: {
          año: Number(año), // Cambia 2022 por el año que desees
        },
      },
      {
        $group: {
          _id: "$mes",
          total: { $sum: 1 },
        },
      },
    ])
    .then((result) => {
      result.forEach((element) => {
        if (element._id == "enero") {
          conteos[0] = element.total;
        } else if (element._id == "febrero") {
          conteos[1] = element.total;
        } else if (element._id == "marzo") {
          conteos[2] = element.total;
        } else if (element._id == "abril") {
          conteos[3] = element.total;
        } else if (element._id == "mayo") {
          conteos[4] = element.total;
        } else if (element._id == "junio") {
          conteos[5] = element.total;
        } else if (element._id == "julio") {
          conteos[6] = element.total;
        } else if (element._id == "agosto") {
          conteos[7] = element.total;
        } else if (element._id == "septiembre") {
          conteos[8] = element.total;
        } else if (element._id == "octubre") {
          conteos[9] = element.total;
        } else if (element._id == "noviembre") {
          conteos[10] = element.total;
        } else if (element._id == "diciembre") {
          conteos[11] = element.total;
        }
      });

      res.json(conteos);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getConsultasPagoAnio/:anio", async (req, res) => {
  console.log(req.params.anio);
  const año = req.params.anio;
  var pagocon = [];
  var conteos = [];
  await consultaSchema
    .aggregate([
      {
        $match: {
          año: Number(año), // Cambia 2022 por el año que desees
        },
      },
      {
        $group: {
          _id: "$pagacon",
          total: { $sum: 1 },
        },
      },
    ])
    .then((result) => {
      result.forEach((element) => {
        pagocon.push(element._id);
        conteos.push(element.total);
      });

      res.json({ pagocon, conteos });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getPrevisionAnio/:anio", async (req, res) => {
  console.log(req.params.anio);
  const año = req.params.anio;
  var prevision = [];
  var conteos = [];
  await consultaSchema
    .aggregate([
      {
        $match: {
          año: Number(año), // Cambia 2022 por el año que desees
        },
      },
      {
        $group: {
          _id: "$prevision",
          total: { $sum: 1 },
        },
      },
    ])
    .then((result) => {
      result.forEach((element) => {
        prevision.push(element._id);
        conteos.push(element.total);
      });

      res.json({ prevision, conteos });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
