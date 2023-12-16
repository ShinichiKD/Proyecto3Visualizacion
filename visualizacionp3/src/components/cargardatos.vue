<template>
    <div class="w-full h-full flex flex-col items-center ">
        
        <div class="h-[90vh] ">

            <v-data-table :headers="encabezado" :items="mostrados" :items-per-page="15" :items-per-page-options="paginas"
                class="h-full items-center">

            </v-data-table>
            <div v-if="estadoBoton" class="text-center -my-96">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>


        </div>
        <div class="h-[10vh] flex flex-row  gap-6 p-4 bg-blue-500 w-full text-white">
            <div class="w-[300px]">
                <v-file-input show-size label="File input" accept=".csv" @change="manejarCambioArchivo">
                </v-file-input>
            </div>
            <div class="w-[300px] ml-3">
                <v-select v-model="value" :items="items" label="Tipo de datos"></v-select>
            </div>
            <div>
                <v-btn  color="#002EE6" :disabled="estadoBoton" @click="addConsultas">Guardar</v-btn>
            </div>
        </div>
        <v-dialog v-model="dialog" width="auto">
            <v-card>
                <v-card-text>
                    Se han agregado correctamente {{agregadas}} consultas y {{malas}} consultas no se han podido agregar porque ya existen.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import API from '../api';
import Swal from 'sweetalert2'
export default {

    data() {
        return {
            csv: null,
            errors: null,
            dialog: false,
            encabezado: [
                { title: "id", key: "id" },
                { title: "usuario", key: "usuario" },
                { title: "fecha", key: "fecha" },
                { title: "hora", key: "hora" },
                { title: "fechahora", key: "fechahora" },
                { title: "tipoconsulta", key: "tipoconsulta" },
                { title: "rutmedico", key: "rutmedico" },
                { title: "prevision", key: "prevision" },
                { title: "pagacon", key: "pagacon" },
                { title: "monto", key: "monto" },
                { title: "mes", key: "mes" },
                { title: "año", key: "año" },
                { title: "semestre", key: "semestre" },
                { title: "trimestre", key: "trimestre" }

            ],
            paginas: [
                { value: 10, title: '10' },
                { value: 15, title: '15' },
                { value: 20, title: '20' },
                { value: 25, title: '25' }
            ],
            datosvalidos: [],
            datosInvalidos: [],
            agregadas:0,
            malas:0,
            items: [
                'Validos',
                'No validos',
                'Guardados'
            ],
            mostrados: [],
            value: "Validos",
            cargandodatos: false,
            meses: [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ],
            estadoBoton: false,
        };
    },
    mounted() {

    },
    watch: {
        async value(newVal, oldVal) {
            this.estadoBoton = true
            
            if (newVal == "Validos") {
                this.mostrados = this.datosvalidos

            } else if (newVal == "Guardados") {

                await API.getConsultas()
                    .then((response) => {
                        
                       
                        this.mostrados = response

                    }).catch((error) => {
                        console.log(error)
                    })

            }
            else {
                this.mostrados = this.datosInvalidos


            }
            this.estadoBoton = false

        }

    },
    methods: {
        async addConsultas() {
            
            if(this.csv != null){
                this.estadoBoton = true
                await API.addConsultas({ consultas: this.datosvalidos })
                .then((response) => {
                    console.log("consultas Añadidas", response)
                    this.agregadas = response.agregadas
                    this.malas = response.malas
                    this.dialog = true
                    this.estadoBoton = false
                }).catch((error) => {
                    console.log(error)
                })
            }else{
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se ha cargado ningun archivo',
                   
                  })
            }
            
        },
        parsearFecha(fecha) {
            const fechapartes = fecha.split(' ')

            const partes = fechapartes[0].split('-')

            const data = partes[2] + "-" + partes[1] + "-" + partes[0]
            fechapartes[0] = data
            return fechapartes

        },


        manejarCambioArchivo(event) {
            
            const file = event.target.files[0];
            this.datosvalidos = []
            this.datosInvalidos = []
            this.mostrados = []

            if (file) {
                this.estadoBoton = true
                const reader = new FileReader();

                reader.onload = (e) => {
                    this.csv = e.target.result;

                    const lineas = this.csv.split('\n');


                    lineas.shift()
                    lineas.pop()
                    lineas.forEach(element => {
                        this.procesarLinea(element);
                    });

                    this.mostrados = this.datosvalidos
                    this.estadoBoton = false


                };

                reader.readAsText(file);
            }
        }, procesarLinea(linea) {
            const partes = linea.split(';') // Suponiendo que el separador es ';'
            /* 0=id - 1=usuario 2 fecha 3 hora 4 fechahora 6 tipoconsulta 7 rutmedico 9 prevision  16 paggacon 22 monto */

            const fechapartes = this.parsearFecha(partes[4])

            const consulta = {
                id: partes[0],
                usuario: partes[1],
                fecha: fechapartes[0],
                hora: fechapartes[1] + ":00",
                fechahora: fechapartes[0] + " " + fechapartes[1] + ":00",
                tipoconsulta: partes[6],
                rutmedico: partes[7],
                prevision: partes[9],
                pagacon: partes[16],
                monto: partes[22],
                mes: this.obtenerMes(fechapartes[0].split('-')[1]),
                año: fechapartes[0].split('-')[0],
                semestre: this.obtenerSemestre(fechapartes[0].split('-')[1]),
                trimestre: this.obtenerTrimestre(fechapartes[0].split('-')[1])
            };



            if (!Number.isNaN(+consulta.id) && this.validarRUT(consulta.usuario) && this.validarFormatoFechaHora(consulta.fecha)
                && this.validarFormatoHora(consulta.hora) && this.validarFormatoFechaHora(consulta.fechahora) && this.validarRUT(consulta.rutmedico)
                && this.validarPrevision(consulta.prevision) && this.validarMedioPago(consulta.pagacon) && !Number.isNaN(+consulta.monto) && this.ValidarTipoconsulta(consulta.tipoconsulta)) {

                this.datosvalidos.push(consulta)
            } else {
                this.datosInvalidos.push(consulta)
            }
        }, validarRUT(rut) {
            // Elimina puntos y guiones y convierte a mayúsculas, si es necesario
            const rutLimpio = rut.replace(/\./g, '').toUpperCase();

            // Verifica el formato con la expresión regular
            const formatoValido = /^[0-9]+-[0-9K]$/.test(rutLimpio);

            return formatoValido;
        }, validarFormatoFechaHora(cadena) {

            const fecha = new Date(cadena);

            // Verificar si la creación del objeto Date fue exitosa
            // y si el objeto es una instancia válida de Date
            return !isNaN(fecha.getTime()) && fecha instanceof Date;
        }, validarPrevision(prevision) {

            if (prevision == 'Fonasa' || prevision == 'Particular' || prevision == 'Isapre') {
                return true;

            } else {
                return false;
            }
        }, validarFormatoHora(cadena) {

            const fecha = new Date("2000-01-01 " + cadena);

            return !isNaN(fecha.getTime()) && fecha instanceof Date;
        }, validarMedioPago(medio) {

            if (medio == 'Efectivo' || medio == 'Debito' || medio == 'Credito') {
                return true;

            } else {
                return false;
            }
        }, obtenerMes(fecha) {
            return this.meses[fecha - 1]
        }, obtenerSemestre(fecha) {
            if (fecha <= 6) {
                return "1"
            } else {
                return "2"
            }
        }, obtenerTrimestre(fecha) {
            if (fecha <= 3) {
                return "1"
            } else if (fecha <= 6) {
                return "2"
            } else if (fecha <= 9) {
                return "3"
            } else {
                return "4"
            }
        }, ValidarTipoconsulta(tipo) {
            if (tipo != "") {
                return true
            } else {
                return false
            }
        }
    }


};
</script>