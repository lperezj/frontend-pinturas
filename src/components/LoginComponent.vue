<template>
  <!-- Section: Design Block -->
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

                  <form>
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <span class="h1 fw-bold mb-0">Mis Pinturas</span>
                    </div>

                    <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Identificate con tu cuenta</h5>

                    <div class="form-outline mb-4">
                      <input type="email" id="form2Example17" class="form-control" v-model="email" placeholder="Dirección correo" />                      
                    </div>

                    <div class="form-outline mb-4">
                      <input type="password" id="form2Example27" class="form-control" v-model="password" placeholder="Contraseña" />                      
                    </div>

                    <div class="pt-1 mb-4">                    
                      <button class="btn btn-primary btn-lg" type="button" v-on:click="LoginUserPassword()">Login</button>
                    </div>

                    <a class="small text-muted" href="#!">¿Olvidaste tu contraseña?</a>
                    <p class="mb-5 pb-lg-2" style="color: #393f81;">¿No tienes una cuenta?
                      <a href="#" style="color: #393f81;" v-on:click="Register()">Registrate aqui</a>
                    </p>                  
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
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import Cookies from 'js-cookie';
        
  export default {
      name: 'LoginComponent',
      mounted(){
        const uid = Cookies.get("USER_UID");
        if (uid != null && uid != ""){
            console.log("Usuario logeado:" + uid);
            router.push({name:'Pinturas'});
        }        
      },
      data(){
        return{
          email : '',
          password : '',
          user: null
        }
      },
      methods:{
        LoginUserPassword(){
          const auth = getAuth();          
          if (this.user != "" && this.password != ""){
            signInWithEmailAndPassword(auth, this.email, this.password).then((userCredential) => {              
              this.user = userCredential;
              console.log("Usuario Logeado:" + this.user.user.uid);
              Cookies.set("USER_UID", this.user.user.uid, { expires: 7 }); // Expires in 7 days              
              router.push({name:'Pinturas'});
            })
            .catch((error) => {
              alert(error.message);
            });
          }            
        },

        Register(){          
          router.push({name:'Register'});
        }
      },      
  }  
</script>

<style scoped>
    .cursor {
        cursor: pointer;
    }

    .rounded-t-5 {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }

    @media (min-width: 992px) {
        .rounded-tr-lg-0 {
        border-top-right-radius: 0;
        }

        .rounded-bl-lg-5 {
        border-bottom-left-radius: 0.5rem;
        }
    }  
</style>