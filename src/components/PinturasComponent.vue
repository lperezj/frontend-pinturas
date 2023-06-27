<template>
    <div style="margin: 15px;">
        <h1 class="display-4 text-center">Pinturas</h1>
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
                                                <i v-bind:class="[color.is_mine ? 'fas fa-bookmark fa-lg' : 'far fa-bookmark fa-lg']" v-on:click="CheckAsMine(color, index)"></i>
                                            </span>
                                            <span class="cursor">                                                
                                                <i v-bind:class="[color.is_wish ? 'fas fa-check-circle fa-lg' : 'far fa-check-circle fa-lg']" v-on:click="CheckAsWish(color, index)"></i>
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
                                        <i v-bind:class="[color.is_mine ? 'fas fa-bookmark fa-lg' : 'far fa-bookmark fa-lg']" v-on:click="CheckAsMine(color, index)"></i>
                                    </span>
                                    <span class="cursor">
                                        <i v-bind:class="[color.is_wish ? 'fas fa-check-circle fa-lg' : 'far fa-check-circle fa-lg']" v-on:click="CheckAsWish(color, index)"></i>
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
    import { getDatabase, ref, get, onValue, child, set, update} from 'firebase/database'    
    import Cookies from 'js-cookie';

    const db = getDatabase(app);
    const uid = Cookies.get("USER_UID");
    export default {
        name: 'PinturasComponent',
        mounted(){                        
            console.log(uid)
            if (uid == null || uid == ""){
                console.log("Usuario no logeado:" + uid);
                router.push({name:'Login'});
            }
            else{                                
                this.CargarPinturas(uid);
            }
        },        
        data(){
            return{
                filtro: '',
                listColores: [],
                listTodosColores : [],
                show_all: false,
                show_mis_pinturas: false,
                show_mis_futuras_pinturas: false,
            }
        },
        methods:{
            CargarPinturas(uid){   
                var auxListColores = [];                             
                const settingsRef = ref(db, 'Paints');
                onValue(settingsRef, (c) => {                    
                    const dbRef = ref(getDatabase());
                    const promises = [];

                    c.forEach((childColor) => {
                        var item = {
                            id: childColor.key,
                            nombre: childColor.child("Nombre").val(),
                            numero: childColor.child("InfoColor").val(),
                            precio: childColor.child("Precio").val(),
                            code: childColor.child("Referencia").val(),
                            imagen: "../assets/" + childColor.child("Imagen").val(),
                            imagen_large: "../assets/" + childColor.child("ImagenLarge").val(),                            
                            is_mine: false,
                            is_wish: false
                        };
                        console.log("ITEM: " + item.imagen_large)

                        promises.push(
                            get(child(dbRef, 'MyPaints/' + uid + '/' + childColor.key)).then((snapshot) => {
                            if (snapshot.exists()) {
                                item.is_mine = true;
                            }})
                        );

                        promises.push(
                            get(child(dbRef, 'WishList/' + uid + '/' + childColor.key)).then((snapshot) => {
                                if (snapshot.exists()) {
                                    item.is_wish = true;
                                }})
                        );
                        auxListColores.push(item);
                    });

                    Promise.all(promises)
                    .then(() => {                        
                        this.listColores = auxListColores;                        
                        this.listTodosColores = auxListColores;
                    })
                    .catch((error) => {
                        console.error("Error en las consultas:", error);
                    });                 
                }, 
                {
                    onlyOnce: false
                });                                
            },
            FiltrarColor(){                
                this.listColores = this.listTodosColores.filter(c => c.nombre.toUpperCase().includes(this.filtro.toUpperCase()));                
            },

            ShowMePictures(){                
                this.listColores = this.listTodosColores.filter(c => c.is_mine);
                this.show_all = false;
                this.show_mis_pinturas = true;
                this.show_mis_futuras_pinturas = false;
            },

            ShowMeWant(){                
                this.listColores = this.listTodosColores.filter(c => c.is_wish);
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
                const uid = Cookies.get("USER_UID");
                var _disponible = !color.is_mine;
                
                this.listColores[index].is_mine = _disponible;                                 
                if (_disponible){
                    set(ref(db, 'MyPaints/' +  uid + "/" + this.listColores[index].id), '');
                }
                else{
                    const updates = {};                    
                    updates['MyPaints/' + uid + '/' +  this.listColores[index].id] = null;

                    update(ref(db), updates);                    
                    if (this.show_mis_pinturas && !_disponible){                        
                        this.listColores.splice(index,1);                                                
                    }                    
                }
            },

            CheckAsWish(color, index){
                const uid = Cookies.get("USER_UID");
                var _disponible = !color.is_mine;
                
                this.listColores[index].is_mine = _disponible;                                 
                if (_disponible){
                    set(ref(db, 'WishList/' +  uid + "/" + this.listColores[index].id), '');
                }
                else{
                    const updates = {};                    
                    updates['WishList/' + uid + '/' +  this.listColores[index].id] = null;

                    update(ref(db), updates);                    
                    if (this.show_mis_pinturas && !_disponible){                        
                        this.listColores.splice(index,1);                                                
                    }                    
                }
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