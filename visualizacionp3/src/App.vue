<script>
import cargardatos from "./components/cargardatos.vue";

import sidebar from "./components/sidebar.vue";
import Plotly from "plotly.js-dist-min";
import API from "./api";

import graficos from "./components/graficos.vue";
import CargarUsuarios from "./components/cargarUsuarios.vue";

export default {
  data() {
    return {
      csv: null,
      errors: null,
      encabezado: null,
      menu: "Tablas",
      usuarios: []
    };
  },
  mounted() { },
  methods: {
    cambioMenu(menu) {
      this.menu = menu;
    }


  },

  components: {
    sidebar,
    cargardatos,
    graficos,
    CargarUsuarios
  },
};
</script>

<template>
  <div class="h-full w-full flex ">
    <div class="bg-[#4063E5] w-1/6 h-full">
      <sidebar @seleccionarMenu="cambioMenu"></sidebar>
    </div>
    <div class="w-full h-ful">
      <div class="" v-if="menu === 'Tablas'">
        <cargardatos />
      </div>

      <div v-if="menu === 'Graficos'" class="">
        <graficos />
      </div>

      <div v-if="menu === 'Cargar'">
        <CargarUsuarios />
       

      </div>

    </div>
    <router-view></router-view>
  </div>
</template>

<style></style>
