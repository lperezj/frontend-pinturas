<template>
    <div style="margin: 15px;">
        <h1 class="display-4 text-center">Mis Pinturas</h1>
        <hr>
        <div class="row">         
            <div class="col-lg-10 offset-lg-1">
                <div class="card mt-4">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a v-bind:class="[this.show_all ? 'nav-link active': 'nav-link']" id="tab_todas" href="#" v-on:click="QuitarFiltrarColor()">Ver todas</a>
                        </li>
                        <li class="nav-item">
                            <a v-bind:class="[this.show_mis_pinturas ? 'nav-link active': 'nav-link']" id="tab_mias" href="#" v-on:click="ShowMePictures()">Mis pinturas</a>
                        </li>
                        <li class="nav-item">
                            <a v-bind:class="[this.show_mis_futuras_pinturas ? 'nav-link active': 'nav-link']" id="tab_quiero" href="#" v-on:click="ShowMeWant()">Las quiero</a>
                        </li>                                        
                        <li class="nav-item ms-auto">
                            <a class="nav-link" href="#" v-on:click="Logout()">Logout</a>
                        </li>
                    </ul>                                        
                    <br>
                    <div class="d-none d-sm-none d-md-block">
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
                                                <i v-bind:class="[color.disponible ? 'fas fa-bookmark fa-lg' : 'far fa-bookmark fa-lg']" v-on:click="CheckAsMine(color, index)"></i>                                            
                                            </span>
                                            <span class="cursor">                                            
                                                <i v-bind:class="[color.favorito ? 'fas fa-check-circle fa-lg' : 'far fa-check-circle fa-lg']" v-on:click="CheckAsFavorite(color, index)"></i>
                                            </span>                                        
                                        </div>
                                    </div>                                
                                </div>
                            </div>                        
                        </div>                    
                    </div>
                    <div class="d-block d-sm-block d-md-none">
                        <div class="row row-cols-1 row-cols-md-5 g-4">
                            <div class="row" v-for="(color, index) of listColores" :key="index">
                                <div class="col">
                                    <img v-bind:src="color.imagen" class="rounded float-left" style="height: 80%;">
                                </div>
                                <div class="col">
                                    <div class="card-body">
                                        <p class="card-text">{{color.code}}</p>
                                        <p class="card-text">{{color.numero}}</p>
                                        <p class="card-text">{{color.precio}}</p>                                    
                                    </div>   
                                </div>      
                                <p class="card-text fw-bold" style="margin-left: 10px;">{{color.nombre}}</p>
                                <div class="list-group-item d-flex justify-content-between align-items-end">
                                    <span class="cursor" style="margin-left: 20px;">
                                        <i v-bind:class="[color.disponible ? 'fas fa-bookmark fa-lg' : 'far fa-bookmark fa-lg']" v-on:click="CheckAsMine(color, index)"></i>
                                    </span>
                                    <span class="cursor">
                                        <i v-bind:class="[color.favorito ? 'fas fa-check-circle fa-lg' : 'far fa-check-circle fa-lg']" v-on:click="CheckAsFavorite(color, index)"></i>
                                    </span>                                        
                                </div>
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                </div>
                </div>
            </div>
        </div>                
    </div>
</template>

<script>            
    import { app } from "../utils/firebase";    
    import { router } from "../router/index.js"
    import { getDatabase, ref, onValue, set } from 'firebase/database'    
    import Cookies from 'js-cookie';

    const db = getDatabase(app);
    const settingsRef = ref(db, 'Oleo')
    export default {
        name: 'PinturasComponent',
        mounted(){
            const uid = Cookies.get("USER_UID");
            if (uid == null || uid == ""){
                console.log("Usuario no logeado:" + uid);
                router.push({name:'Login'});
            }
            else{
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
            }
        },
        data(){
            return{
                filtro: '',
                listColores: [],
                listTodosColores : [],
                show_all: true,
                show_mis_pinturas: false,
                show_mis_futuras_pinturas: false,
            }
        },
        methods:{            
            FiltrarColor(){                
                this.listColores = this.listTodosColores.filter(c => c.nombre.toUpperCase().includes(this.filtro.toUpperCase()));                
            },

            ShowMePictures(){                
                // this.show_mis_pinturas = !this.show_mis_pinturas;                
                // if (this.show_mis_pinturas){
                //     this.listColores = this.listTodosColores.filter(c => c.nombre.toUpperCase().includes(this.filtro.toUpperCase()) && c.disponible);                        
                // }else{                    
                //     this.listColores = this.listTodosColores;                    
                // }
                this.listColores = this.listTodosColores.filter(c => c.disponible);
                this.show_all = false;
                this.show_mis_pinturas = true;
                this.show_mis_futuras_pinturas = false;
            },

            ShowMeWant(){                
                // this.show_mis_pinturas = !this.show_mis_pinturas;                
                // if (this.show_mis_pinturas){
                //     this.listColores = this.listTodosColores.filter(c => c.nombre.toUpperCase().includes(this.filtro.toUpperCase()) && c.disponible);                        
                // }else{                    
                //     this.listColores = this.listTodosColores;                    
                // }
                this.listColores = this.listTodosColores.filter(c => c.favorito);
                this.show_all = false;
                this.show_mis_pinturas = false;
                this.show_mis_futuras_pinturas = true;
            },
           
            QuitarFiltrarColor(){
                this.listColores = this.listTodosColores;
                this.show_all = true;
                this.show_mis_pinturas = false;
                this.show_mis_futuras_pinturas = false;
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
            },

            Logout(){
                Cookies.remove("USER_UID");            
                router.push({name:'Login'});            
            }
        }
    }
</script>

<style scoped>
.cursor {
    cursor: pointer;
}
</style>