<template>
    <!-- <section class="vh-100" style="background-color: #eee;">
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-lg-12 col-xl-11">
                    <div class="card text-black" style="border-radius: 25px;">
                        <div class="card-body p-md-5">
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                    <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registro</p>
                                    <form class="mx-1 mx-md-4">

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <input type="text" id="form3Example1c" class="form-control" placeholder="Nombre de usuario" />                                                
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <input type="email" id="form3Example3c" class="form-control" placeholder="Dirección correo" />                                                
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <input type="password" id="form3Example4c" class="form-control" placeholder="Contraseña" />                                                
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <input type="password" id="form3Example4cd" class="form-control" placeholder="Repite tu contraseña" />                                                
                                            </div>
                                        </div>
                                        
                                        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="button" class="btn btn-primary btn-lg">Register</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section> -->

    <section class="vh-100" style="background-color: #9A616D;">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">              
                <img src="../assets/oleo.jpg" 
                  alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem;" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">                    
                    <form class="mx-1 mx-md-4">
                        <div class="d-flex align-items-center mb-3 pb-1">
                          <span class="h1 fw-bold mb-0">Registro</span>
                        </div>
                        <div class="d-flex flex-row align-items-center mb-4">
                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                            <div class="form-outline flex-fill mb-0">
                                <input type="text" id="form3Example1c" class="form-control" v-model="user_name" placeholder="Nombre de usuario" />                                                
                            </div>
                        </div>

                        <div class="d-flex flex-row align-items-center mb-4">
                            <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                            <div class="form-outline flex-fill mb-0">
                                <input type="email" id="form3Example3c" class="form-control" v-model="email" placeholder="Dirección correo" />                                                
                            </div>
                        </div>

                        <div class="d-flex flex-row align-items-center mb-4">
                            <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                            <div class="form-outline flex-fill mb-0">
                                <input type="password" id="form3Example4c" class="form-control" v-model="password_a" placeholder="Contraseña" />                                                
                            </div>
                        </div>

                        <div class="d-flex flex-row align-items-center mb-4">
                            <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                            <div class="form-outline flex-fill mb-0">
                                <input type="password" id="form3Example4cd" class="form-control" v-model="password_b" placeholder="Repite tu contraseña" />                                                
                            </div>
                        </div>

                        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="button" class="btn btn-primary btn-lg" v-on:click="RegisterNewUser()">Register</button>
                        </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import { router } from '../router/index.js'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database'    


export default {
    setup () {        
        return {}
    },
    data(){
        return{
            email : '',
            password_a : '',
            password_b : '',
            user_name : ''
        }
    },
    methods:{
        RegisterNewUser(){
            if (this.email == '' || this.user_name == '' || this.password_a == '' || this.password_b == ''){                
                alert("Todos los campos son obligatorios");
            }
            else{
                if (this.password_a != this.password_b){
                    alert("Las contraseñas no coinciden");
                }
                else{                                        
                    const auth = getAuth();
                    const db = getDatabase();
                    
                    createUserWithEmailAndPassword(auth, this.email, this.password_a)
                    .then((userCredential) => {             
                        this.user = userCredential;
                        set(ref(db, 'Users/' +  this.user.user.uid), {
                            Nombre: this.user_name,
                            Email: this.email
                        });

                        set(ref(db, 'MyPaints/' +  this.user.user.uid), '');
                        set(ref(db, 'WishList/' +  this.user.user.uid), '');

                        router.push({name:'Login'});                                                
                    })
                    .catch((error) => {                        
                        console.log(error.code);
                        console.log(error.message);
                    });
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>>