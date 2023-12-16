<template>
    <div class="w-full h-full bg-slate-400 flex flex-col ">

        <div id="tester" class="h-[90vh] w-full">



        </div>

        <div class="h-[10vh]  w-full  flex bg-blue-500 text-white">
            <div class="h-full w-[30vh]  flex items-center p-4">

                <v-select v-model="valueOpciones" :disabled="estadoBoton" :items="opciones" item-title="nombre"
                    item-value="nombre" label="Graficos disponibles" return-object class=" w-full">
                </v-select>
            </div>
            <div class="h-full w-full  flex items-center gap-4 mr-4">



                <v-select v-model="valueCajero" multiple v-if="valueOpciones.opcion === 5" :items="cajeros"
                    item-title="nombre" item-value="nombre" return-object label="Cajeros(1 a 4)">
                </v-select>

                <v-select v-model="valueMedico" v-if="valueOpciones.opcion === 1 ||
                    valueOpciones.opcion === 2" :multiple="doctoresMultiple" :items="doctores" item-title="nombre"
                    item-value="nombre" return-object :label="labelDoctores">
                </v-select>

                <v-select v-model="valueMes" v-if="valueOpciones.opcion === 1" :items="meses" label="Meses">
                </v-select>
                <v-select v-if="valueOpciones.opcion === 5" v-model="valueTrimestre" :items="trimestre" label="Trimestres">
                </v-select>

                <v-select v-model="valuePrevision" v-if="valueOpciones.opcion === 2" :items="prevision" label="Prevision">
                </v-select>

                <v-select v-model="valueAño" v-if="valueOpciones.opcion === 1 ||
                    valueOpciones.opcion === 2 ||
                    valueOpciones.opcion === 3 ||
                    valueOpciones.opcion === 4 ||
                    valueOpciones.opcion === 5 ||
                    valueOpciones.opcion === 7

                    " :items="Años" label="Años">
                </v-select>
               
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 1" :disabled="estadoBoton" @click="grafico1">graficar</v-btn>
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 2" :disabled="estadoBoton" @click="grafico2">graficar</v-btn>
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 3" :disabled="estadoBoton" @click="grafico3">graficar</v-btn>
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 4" :disabled="estadoBoton" @click="grafico4">graficar</v-btn>
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 5" :disabled="estadoBoton" @click="grafico5">graficar</v-btn>
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 6" :disabled="estadoBoton" @click="grafico6">graficar</v-btn>
                <v-btn  color="#002EE6" v-if="valueOpciones.opcion === 7" :disabled="estadoBoton" @click="grafico7">graficar</v-btn>

            </div>

        </div>
    </div>
</template>
<script >
import API from '../api';

import Plotly from 'plotly.js-dist-min'
import Swal from 'sweetalert2'

export default {

    data() {
        return {
            valueOpciones: { opcion: 1, nombre: "Recaudaciones medicos" },

            opciones: [
                { opcion: 1, nombre: "Recaudaciones medicos" },
                { opcion: 2, nombre: "Atenciones medicos por prevision" },
                { opcion: 3, nombre: "Atenciones por prevision y año" },
                { opcion: 4, nombre: "Transacciones por meses año" },
                { opcion: 5, nombre: "Transacciones cajeros" },
                { opcion: 6, nombre: "Transacciones año" },
                { opcion: 7, nombre: "Medios de pago " }


            ],
            doctoresMultiple: false,
            labelDoctores: "Doctores",
            valueMedico: "",
            valueCajero: "",
            items: [],
            value: "",
            trimestre: [
                1, 2, 3, 4
            ],
            valueMes: "enero",
            meses: [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ],
            valueTrimestre: 1,
            Años: [
                "2021", "2022", "2023"
            ],
            prevision: [
                "Fonasa", "Particular", "Sin prevision"
            ],
            valueAño: "2021",
            cajeros: [],
            nombres: [],
            conteos: [],
            doctores: [
            ],
            rut: "",
            cajerosSeleccionados: [],
            estadoBoton: false,
            valuePrevision: "Particular",
            config: {
                responsive: true,
                showlegend: true,

            },
            nombreMedico: ""

        };
    },
    mounted() {

        this.getMedicos()
        this.getCajeros()
        Plotly.newPlot('tester', [], this.config);
    },

    methods: {
        async getCajeros() {
            await API.getCajeros().then((response) => {
                this.cajeros = response

                this.valueCajero = this.cajeros[0]

            }).catch((error) => {
                console.log(error);
            });



        },
        async getMedicos() {
            await API.getMedicos().then((response) => {

                this.doctores = response

                this.valueMedico = this.doctores[0]

            }).catch((error) => {
                console.log(error);
            });



        },
        rellenarGraficoTorta(x, y, titulo) {
            const trace1 = {
                type: 'pie',
                labels: x,
                values: y,
                text: y.map(String),
                textposition: 'auto',


            };
            const data = [trace1];


            var layout = {
                title: titulo,
                font: { size: 18 }
            };
            const config = {
                responsive: true,
                showlegend: true,

            }

            Plotly.newPlot('tester', data, layout, config);
        },
        rellenarGraficoBarras(x, y, color, titulo) {
            const trace1 = {
                type: 'bar',
                x: x,
                y: y,
                text: y.map(String),
                textposition: 'auto',
                marker: {
                    color: color,
                    line: {
                        width: 2.5
                    }
                }
            };
            var layout = {
                title: titulo,
                font: { size: 18 }
            };
            const data = [trace1];



            const config = { responsive: true }

            Plotly.newPlot('tester', data, layout, config);
        },
        async grafico1() {
            this.estadoBoton = true
            await API.getConsultasMedico(this.rut, this.valueMes, this.valueAño)
                .then((response) => {

                    this.dias = response.dias
                    this.montos = response.sumaMontosPorDia
                    this.rellenarGraficoBarras(this.dias, this.montos, "#C8A2C8", "Recaudaciones "
                        + this.nombreMedico + " mes de " + this.valueMes + " año " + this.valueAño)
                    this.estadoBoton = false
                }).catch((error) => {
                    console.log(error);
                });

        }, async grafico2() {
            var valido = false
            console.log(this.valueMedico)
            if (Array.isArray(this.valueMedico)) {
                if (this.valueMedico.length > 0 && this.valueMedico.length <= 4) {
                    valido = true
                } else {
                    valido = false
                }
            } else {
                valido = true
            }

            if (valido) {
                this.estadoBoton = true
                await API.getMedicoPrevision(this.valueMedico, this.valueMes, this.valueAño, this.valuePrevision)
                    .then((response) => {
                        console.log(response);
                        this.nombres = response.nombres
                        this.montos = response.montos

                        console.log(this.nombres)

                        this.rellenarGraficoBarras(this.nombres, this.montos, ["#77ADDF", "#CB76E1", "#E0D259", "#95E18C"],
                            "Recaudaciones " + this.valuePrevision + " " + this.valueMes + " año " + this.valueAño)
                        this.estadoBoton = false
                    }).catch((error) => {
                        console.log(error);
                    });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No puedes realizar esta acción",


                });
            }
        }, async grafico3() {
            this.estadoBoton = true
            await API.getPrevisionAnio(this.valueAño)
                .then((response) => {

                    console.log(response)
                    this.rellenarGraficoTorta(response.prevision, response.conteos, 
                         "Atenciones por prevision año " + this.valueAño
                    )


                    this.estadoBoton = false

                }).catch((error) => {
                    console.log(error);
                });
        }, async grafico4() {
            this.estadoBoton = true
            await API.getConsultasMesesAnio(this.valueAño)
                .then((response) => {
                    console.log(response);
                    this.transacciones = response

                    this.rellenarGraficoBarras(this.meses, response,
                        ["#77ADDF", "#CB76E1", "#E0D259", "#95E18C", "#6B73EB", "#EA6D5F", "#EAA421", "#27EA00", "#5BEBCD", "#EADAE9", "#EB0101", "#0B00EA"],
                        "Transacciones año " + this.valueAño + " por meses"
                    )

                    this.estadoBoton = false

                }).catch((error) => {
                    console.log(error);
                });
        }, async grafico5() {
            var valido = false
            if (Array.isArray(this.valueCajero)) {
                if (this.valueCajero.length > 0 && this.valueCajero.length <= 4) {
                    valido = true
                } else {
                    valido = false
                }
            } else {
                valido = true
            }

            if (valido) {
                this.estadoBoton = true
                await API.getTransaccionesCajeros(this.valueCajero, this.valueTrimestre, this.valueAño)
                    .then((response) => {

                        this.nombres = response.nombres
                        this.conteos = response.conteos
                        this.rellenarGraficoBarras(this.nombres, this.conteos, ["#77ADDF", "#CB76E1", "#E0D259", "#95E18C"],
                            "Transacciones cajeros trimestre numero " + this.valueTrimestre + " año " + this.valueAño
                        )

                        this.estadoBoton = false
                    }).catch((error) => {
                        console.log(error);
                    });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No puedes realizar esta acción",


                });
            }
        }, async grafico6() {
            this.estadoBoton = true
            await API.getConsultasAños()
                .then((response) => {
                    console.log(response);
                    this.transacciones = response

                    this.rellenarGraficoTorta(response.años, response.conteos,
                        "Transacciones por año"
                    )

                    this.estadoBoton = false

                }).catch((error) => {
                    console.log(error);
                });
        }, async grafico7() {
            this.estadoBoton = true
            await API.getConsultasPagoAnio(this.valueAño)
                .then((response) => {

                    this.rellenarGraficoTorta(response.pagocon, response.conteos,

                        "Transacciones por medio de pago año " + this.valueAño)



                    this.estadoBoton = false

                }).catch((error) => {
                    console.log(error);
                });
        }

    }, watch: {
        valueMedico(newVal, oldVal) {

            console.log(newVal)
            this.nombreMedico = newVal.nombre
            this.rut = newVal.rut


        },
        valueOpciones(nuevo, antiguo) {
            Plotly.newPlot('tester', []);

            if (nuevo.opcion == 1) {
                this.valueMedico = this.doctores[0]
                this.labelDoctores = "Doctores"
                this.doctoresMultiple = false
            } else {
                if (nuevo.opcion == 2) {
                    this.labelDoctores = "Doctores (1 a 4)"
                    this.doctoresMultiple = true
                }
            }
        }

    },


};
</script>