import express from "express";
const router = express.Router();

// importar el modelo nota
import consultaSchema from "../models/consulta";
import usuarioSchema from "../models/usuario";

router.post("/addConsultas", async (req, res) => {
  const consultas = req.body.consultas;
  const agregadas = [];
  for (const element of consultas) {
    element.fechahora = new Date(element.fechahora);
    element.fechahora.setUTCHours(element.hora.split(":")[0], element.hora.split(":")[1], 0, 0);
    
    await consultaSchema(element)
    
      .save()
      .then(async (result) => {
        
        console.log("agregado correctamente");
        agregadas.push(result);
       
        await usuarioSchema
          .findOneAndUpdate(
            { rut: result.rutmedico },
            { $push: { consultas: result._id } },
            { new: true }
          )
          .then((result3) => {
            
          })
          .catch((err) => {
            console.log(err);
          });
        await usuarioSchema
          .findOneAndUpdate(
            { rut: result.usuario },
            { $push: { consultas: result._id } },
            { new: true }
          )
          .then((result2) => {
            
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("error al agregar");
        console.log(err);
      });
  }
  console.log("agregadas", agregadas.length, "consultas", consultas.length);
  res.json({ agregadas: agregadas });
});
router.get("/getConsultas", async (req, res) => {
  await consultaSchema.find()
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log(err);
  });
  
});

router.get("/getConsultasAnios", async (req, res) => {
  
  var transacciones = new Array(3).fill(0);
  await consultaSchema.find()
  .then((result) => {
    result.forEach(element => {
      if(element.año==2021){
        transacciones[0]++;
      }else if(element.año==2022){
        transacciones[1]++;
      }
      else if(element.año==2023){
        transacciones[2]++;
      }

    });
    res.json(transacciones);
  })
  .catch((err) => {
    console.log(err);
  });
  
});

router.get("/getConsultasMesesAnio/:anio", async (req, res) => {
  console.log(req.params.anio)
  const año = req.params.anio;
  var conteos = []
  await consultaSchema.aggregate(
    [
      {
        $match: {
          año: Number(año) // Cambia 2022 por el año que desees
        }
      },
      {
        $group: {
          _id: "$mes",
          total: { $sum: 1 }
        }
      }
    ]
  )
  .then((result) => {
   
    result.forEach(element => {
        if(element._id=="enero"){
          conteos[0]=element.total;
        }else if(element._id=="febrero"){
          conteos[1]=element.total;
        }else if(element._id=="marzo"){
          conteos[2]=element.total;
        }else if(element._id=="abril"){
          conteos[3]=element.total;
        }else if(element._id=="mayo"){
          conteos[4]=element.total;
        }else if(element._id=="junio"){
          conteos[5]=element.total;
        }else if(element._id=="julio"){
          conteos[6]=element.total;
        }else if(element._id=="agosto"){
          conteos[7]=element.total;
        }else if(element._id=="septiembre"){
          conteos[8]=element.total;
        }else if(element._id=="octubre"){
          conteos[9]=element.total;
        }else if(element._id=="noviembre"){
          conteos[10]=element.total;
        }else if(element._id=="diciembre"){
          conteos[11]=element.total;
        }
      });

     
   
    res.json(conteos);
  })
  .catch((err) => {
    console.log(err);
  });
  
});
router.get("/getConsultasPagoAnio/:anio", async (req, res) => {
  console.log(req.params.anio)
  const año = req.params.anio;
  var pagocon = []
  var conteos = []
  await consultaSchema.aggregate(
    [
      {
        $match: {
          año: Number(año) // Cambia 2022 por el año que desees
        }
      },
      {
        $group: {
          _id: "$pagacon",
          total: { $sum: 1 }
        }
      }
    ]
  )
  .then((result) => {
   
    result.forEach(element => {
    
      pagocon.push(element._id);
      conteos.push(element.total);
      

    });
   
    res.json({pagocon,conteos});
  })
  .catch((err) => {
    console.log(err);
  });
  
});
router.get("/getPrevisionAnio/:anio", async (req, res) => {
  console.log(req.params.anio)
  const año = req.params.anio;
  var prevision = []
  var conteos = []
  await consultaSchema.aggregate(
    [
      {
        $match: {
          año: Number(año) // Cambia 2022 por el año que desees
        }
      },
      {
        $group: {
          _id: "$prevision",
          total: { $sum: 1 }
        }
      }
    ]
  )
  .then((result) => {
   
    result.forEach(element => {
    
      prevision.push(element._id);
      conteos.push(element.total);
      

    });
   
    res.json({prevision,conteos});
  })
  .catch((err) => {
    console.log(err);
  });
  
});



module.exports = router;
