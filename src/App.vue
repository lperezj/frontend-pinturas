<template>
  <div>
        <h1 class="display-4 text-center">Mis Pinturas</h1>
        <hr>
        <div class="row">         
            <div class="col-lg-10 offset-lg-1">
                <div class="card mt-4">
                     
                    <div class="input-group" style="align-items: center;">
                        <input type="text"
                            v-model="filtro"
                            class="form-control form-control-lg" 
                            placeholder="Filtrar"
                            v-on:keyup="FiltrarColor"/>
                        <i id="id-show-me-pictures" v-bind:class="[this.show_mis_pinturas ? 'fas fa-bookmark fa-lg': 'far fa-bookmark fa-lg']" style="margin:10px" v-on:click="ShowMePictures()"></i>                        
                    </div>
                    <br>  
                    <div class="row row-cols-1 row-cols-md-5 g-4">
                        <div class="col" v-for="(color, index) of listColores" :key="index">
                            <div class="card">                                
                                <img v-bind:src="color.imagen_large" class="img-thumbnail" style="border: 0; aspect-ratio: 1/1;">
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
                                            <i v-bind:class="[color.favorito ? 'fas fa-check-circle' : 'far fa-check-circle']" v-on:click="CheckAsFavorite(color, index)"></i>
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
    import { getDatabase, ref, onValue, set } from 'firebase/database'

    const db = getDatabase(app);
    const settingsRef = ref(db, 'Oleo')
    export default {
        name: 'ListPinturas',
        mounted(){                        
            onValue(settingsRef, (c) => {
                if (this.listColores.length != 0){
                    return;
                }                
                c.forEach((childColor) => {
                    this.listColores.push({ 
                        id: childColor.key,
                        nombre: childColor.child("Nombre").val(),
                        numero: childColor.child("InfoColor").val(),
                        precio:  childColor.child("Precio").val(),
                        favorito: childColor.child("Favorite").val(),
                        disponible: childColor.child("Available").val(),
                        code: childColor.child("Referencia").val(),
                        imagen: childColor.child("Imagen").val(),
                        imagen_large: childColor.child("ImagenLarge").val(),
                    })
                });
                //alert('[Mounted.OnValue] Se han cargado ' + this.listColores.length + ' registros');
            }, 
            {
                onlyOnce: false
            });

            this.listTodosColores = this.listColores;
        },
        data(){
            return{
                filtro: '',
                listColores: [],
                listTodosColores : [],
                show_mis_pinturas: false
            }
        },
        methods:{            
            FiltrarColor(){                
                this.listColores = this.listTodosColores.filter(c => c.nombre.includes(this.filtro));                
            },

            ShowMePictures(){                
                this.show_mis_pinturas = !this.show_mis_pinturas;                
                if (this.show_mis_pinturas){
                    this.listColores = this.listTodosColores.filter(c => c.nombre.includes(this.filtro) && c.disponible);                        
                }else{                    
                    this.listColores = this.listTodosColores;                    
                }                                
            },
           
            QuitarFiltrarColor(){
                this.listColores = this.listTodosColores;
            },

            CheckAsMine(color, index){                
                var _disponible = !color.disponible;

                this.listColores[index].disponible = _disponible; 
                if (this.show_mis_pinturas && !_disponible){                    
                    this.listColores.splice(index,1);
                }
                                                
                var refAvailable = ref(db, 'Oleo/' + color.id + '/Available/');
                set(refAvailable, _disponible);
                //alert('[CheckAsMine] Se han cargado ' + this.listColores.length + ' registros');
            },

            CheckAsFavorite(color, index){
                var _favorite = !color.favorito;
                this.listColores[index].favorito = _favorite;
                                
                var refAvailable = ref(db, 'Oleo/' + color.id + '/Favorite/');
                set(refAvailable, _favorite);
                //alert('[CheckAsFavorite] Se han cargado ' + this.listColores.length + ' registros');
            }
        }
    }
</script>

<style scoped>
.cursor {
    cursor: pointer;
}
</style>
