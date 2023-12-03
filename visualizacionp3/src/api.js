import axios from "axios";

// TIENEN QUE CAMBIARLO CON SU NETWORK PARA QUE FUNCIONE EN CELU, SINO NO FUNCA XD

const url = "http://localhost:8080/api/";

export default class API {
  //LLAMADAS USUARIO
  static async addConsultas(data) {
    try {
      const res = await axios.post(url + "addConsultas", data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getConsultas() {
    try {
      const res = await axios.get(url + "getConsultas");
      console.log(res.data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getMedicos() {
    try {
      const res = await axios.get(url + "getMedicos");
      console.log(res.data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getConsultasMedico(rut, mes, anio) {
    try {
      const res = await axios.get(
        url + "getConsultasMedico/" + rut + "/" + mes + "/" + anio
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }

  static async getTransaccionesCajeros(cajeros, trimestre, anio) {
    try {
      const res = await axios.get(url + "getTransaccionesCajeros/", {
        params: {
          cajeros: cajeros,
          trimestre: trimestre,
          anio: anio,
        },
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getMedicoPrevision(medicos, mes, anio, prevision) {
    try {
      const res = await axios.get(url + "getMedicoPrevision/", {
        params: {
          medicos: medicos,
          mes: mes,
          anio: anio,
          prevision: prevision,
        },
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }

  static async addUsuarios(data) {
    try {
      const res = await axios.post(url + "addUsuarios", data);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getConsultasAños() {
    try {
      const res = await axios.get(url + "getConsultasAnios");
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getCajeros() {
    try {
      const res = await axios.get(url + "getCajeros");
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getConsultasMesesAnio(anio) {
    try {
      const res = await axios.get(url + "getConsultasMesesAnio/" + anio);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getConsultasPagoAnio(anio) {
    try {
      const res = await axios.get(url + "getConsultasPagoAnio/" + anio);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
  static async getPrevisionAnio(anio) {
    try {
      const res = await axios.get(url + "getPrevisionAnio/" + anio);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
}
