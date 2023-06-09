<template>
  <div>
        <h1 class="display-4 text-center">Mis Pinturas</h1>
        <hr>
        <div class="row">         
            <div class="col-lg-10 offset-lg-1">
                <div class="card mt-4">
                     
                    <!-- <div class="input-group">
                        <input type="text" v-model="color" 
                            class="form-control form-control-lg" 
                            placeholder="Agregar pintura">
                        <div class="input-group-append">
                            <button
                                v-on:click="agregarColor()"
                                class="btn btn-success btn-lg">Agregar</button>
                        </div>
                    </div>
                    <br>   -->
                    <div class="row row-cols-1 row-cols-md-5 g-4">
                        <div class="col" v-for="(color, index) of listColores" :key="index">
                            <div class="card">
                                <img v-bind:src="color.imagen" class="img-thumbnail">
                                <div class="card-body">
                                    <p class="card-text fw-bold">{{color.nombre}}</p>
                                    <div class="list-group-item d-flex justify-content-between align-items-end">
                                        <span>
                                            <p class="card-text">{{color.numero}}</p>
                                        </span>
                                        <span>
                                            <p class="card-text">{{color.code}}</p>
                                        </span>
                                    </div>
                                    
                                    <p class="card-text">{{color.precio}}</p>
                                    <div class="list-group-item d-flex justify-content-between align-items-end">
                                        <span class="cursor"> 
                                            <i v-bind:class="[color.disponible ? 'fas fa-bookmark' : 'far fa-bookmark']" v-on:click="CheckAsMine(color, index)"></i>                                            
                                        </span>
                                        <span class="cursor"> 
                                            <i v-bind:class="[color.favorito ? 'fas fa-star' : 'far fa-star']" v-on:click="CheckAsFavorite(color, index)"></i>
                                        </span>                                        
                                    </div>
                                </div>                                
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>
 
<script>        
    //import { auth, app } from "./utils/firebase";
    import { app } from "./utils/firebase";    
    import { getDatabase, ref, onValue } from 'firebase/database'

    const db = getDatabase(app);
    const settingsRef = ref(db, 'Oleo')

    export default {
        name: 'ListPinturas',
        mounted(){
            console.log("Recorriendo los datos");
            onValue(settingsRef, (color) => {                     
                color.forEach((childColor) => {
                    this.listColores.push({ 
                        nombre: childColor.child("Nombre").val(),
                        numero: childColor.child("InfoColor").val(),
                        precio:  childColor.child("Precio").val(),
                        favorito: childColor.child("Favorite").val(),
                        disponible: childColor.child("Available").val(),
                        code: childColor.child("Referencia").val(),
                        imagen: childColor.child("Imagen").val()
                    })
                })                
            }, 
            {
                onlyOnce: false
            });            

            console.log('Elementos Guardados', this.listColores.length)
        },
        data(){
            return{
                color: '',
                listColores: [],
                listDemoColores : [                    
                     { nombre: 'Blanco', numero: 'Num. 1', precio: '8,90', favorito: false, disponible: false, code: 90000110, imagen: 'https://vpiera.com/16002-large_default/oleo-titan-blanco-titan-n-01-tubo-60-ml.jpg' },
                     { nombre: 'Amarillo Napoles', numero: 'Num. 8', precio: '8,90 €', favorito: false, disponible: false, code: 90000110, imagen: 'https://vpiera.com/16010-llistat_productes/oleo-titan-amarillo-napoles-n08-tubo-60-ml.jpg' },
                     { nombre: 'Amarillo Cadmio Limon', numero: 'Num. 11', precio: '19,90 €', favorito: false, disponible: false, code: 90000110, imagen: 'https://vpiera.com/16016-llistat_productes/oleo-titan-amarillo-cadmio-limon-n-11-tubo-60-ml.jpg' },
                     { nombre: 'Amarillo Stil de Grain', numero: 'Num. 19', precio: '19,90 €', favorito: false, disponible: false, code: 90000110, imagen: 'https://vpiera.com/16024-llistat_productes/oleo-titan-amarillo-stil-de-grain-n19-tubo-60-ml.jpg' },
                     { nombre: 'Rojo Cadmio', numero: 'Num. 24', precio: '29,93 €', favorito: false, disponible: false, code: 90000110, imagen: 'https://vpiera.com/16050-llistat_productes/oleo-titan-rojo-cadmio-oscuro-tubo-n-24-60-ml.jpg' },
                ]
            }
        },
        methods:{
            // agregarColor(){
            //     const color = {
            //         nombre: this.color,
            //         favorito: false,
            //         disponible: false
            //     }
            //     this.listColores.push(color);
            //     this.color = '';
            // },

            CheckAsMine(color, index){
                this.listDemoColores[index].disponible = !color.disponible;
            },

            CheckAsFavorite(color, index){
                this.listDemoColores[index].favorito = !color.favorito;
            }
        }
    }
</script>

<style scoped>
.cursor {
    cursor: pointer;
}
</style>
