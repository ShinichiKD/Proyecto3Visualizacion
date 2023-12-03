<template>
    <div class="w-full h-full bg-blue-500 flex flex-col  text-white">
        <div class="text-center h-[2vh]">PREVISUALIZACION</div>
        <div class="h-[88vh] ">
            <v-data-table :headers="encabezado" :items="mostrados" :items-per-page="15" :items-per-page-options="paginas"
                loading-text="Loading... Please wait" class="h-full">

            </v-data-table>
        </div>
        <div class="h-[10vh] flex flex-row gap-6 p-4">
            <div class="w-[300px]">
                <v-file-input label="File input" @change="manejarCambioArchivo"></v-file-input>
            </div>
            <div class="w-[300px] ml-3">
                <v-select v-model="value" :items="roles" label="rol"></v-select>
            </div>
            <div>
                <v-btn :disabled="estadoBoton" @click="guardarUsuarios">Guardar</v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import API from '../api';

export default {

    data() {
        return {
            csv: null,
            value:"Cajero",
            encabezado: [
                { title: "nombre", key: "nombre" },
                { title: "rut", key: "rut" },
            ],
            paginas: [
                { value: 10, title: '10' },
                { value: 15, title: '15' },
                { value: 20, title: '20' },
                { value: 25, title: '25' }
            ],
            roles:["Cajero","Medico"],
            datosvalidos:[],
            estadoBoton: false,
        };
    },
    mounted() {

    },
    watch: {
        value(){
            if(this.mostrados!=null){
                this.mostrados.forEach(element => {
                    element.rol = this.value
                });
                console.log(this.mostrados)
            }
        }

    },
    methods: {
        


        manejarCambioArchivo(event) {
            const file = event.target.files[0];
            
            this.estadoBoton = true
            if (file) {
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

           

            const consulta = {
                rut: partes[0],
                nombre: partes[1],
                rol: this.value
            };

            console.log(consulta)

            if (this.validarRUT(consulta.rut) && consulta.nombre != "") {
                
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
        },async guardarUsuarios(){
            this.estadoBoton = true
            await API.addUsuarios({ usuarios: this.mostrados })
            .then((response) => {
              console.log("usuarios Añadidas", response)
              this.estadoBoton = false
            }).catch((error) => {
                this.estadoBoton = false
              console.log(error)
            })
        }
    }


};
</script>