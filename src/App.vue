<template>
  <div>
        <h1 class="display-4 text-center">Mis Pinturas</h1>
        <hr>
        <div class="row">         
            <div class="col-lg-10 offset-lg-1">
                <div class="card mt-4">
                     
                    <div class="input-group">
                        <input type="text"
                            v-model="filtro"
                            class="form-control form-control-lg" 
                            placeholder="Filtrar"
                            v-on:keyup="FiltrarColor">
                    </div>
                    <br>  
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
            onValue(settingsRef, (c) => {                     
                c.forEach((childColor) => {
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

            this.listTodosColores = this.listColores;
            console.log('Elementos Guardados', this.listColores.length)
        },
        data(){
            return{
                filtro: '',
                listColores: [],
                listTodosColores : []
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
            FiltrarColor(){
                console.log("Color Filtrar:",this.filtro);
                this.listColores = this.listTodosColores.filter(c => c.nombre.includes(this.filtro));                
            },

            QuitarFiltrarColor(){
                this.listColores = this.listTodosColores;
            },

            CheckAsMine(color, index){
                this.listColores[index].disponible = !color.disponible;
            },

            CheckAsFavorite(color, index){
                this.listColores[index].favorito = !color.favorito;
            }
        }
    }
</script>

<style scoped>
.cursor {
    cursor: pointer;
}
</style>
