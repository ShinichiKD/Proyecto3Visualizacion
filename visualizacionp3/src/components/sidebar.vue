<template>
    <div class="flex flex-col h-screen gap-2">

        <div class="bg-[#002EE6] h-[40px] rounded-xl gap-2 text-white flex justify-center p-2 m-4
         hover:bg-blue-900 hover:transition-colors" @click="seleccionarMenu('Tablas')">
            <span>Tablas</span>
            <v-icon end icon="mdi-table mdi-36px"></v-icon>
        </div>

        <div class="bg-[#002EE6] h-[40px] rounded-xl gap-2 text-white flex justify-center p-2 m-4
         hover:bg-blue-900 hover:transition-colors" @click="seleccionarMenu('Graficos')">
            <span>Gráficos</span>
            <v-icon end icon="mdi-chart-bar mdi-36px"></v-icon>
        </div>
        
        <div class="bg-[#002EE6] h-[40px] rounded-xl gap-2 text-white flex justify-center p-2 m-4
         hover:bg-blue-900 hover:transition-colors" @click="seleccionarMenu('Cargar')">
            <span>Cargar usuarios</span>
            <v-icon end icon="mdi-file-upload mdi-36px"></v-icon>
        </div>



       
        
    </div>
</template>
<script>

export default {

    data() {
        return {
            
        };
    },
    mounted() {

    },
    methods: {
        seleccionarMenu(menu) {
            this.$emit('seleccionarMenu', menu);
        }
    }


};
</script>