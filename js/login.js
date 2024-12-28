
/**
 * MARK: Falta terminar el login
 * Clase para gestionar los datos de los usuarios el login y registro
 */
class user {

    jsonUrl = "http://localhost:3000/users" //url a la que se le haran las consultas
    data

    /**
     * Crea el objeto que usara la clase para la gestion del usuario
     * @param {{Object.atributte}}  username - nombre del usuario
     * @param {{Object.atributte}}  password - contraseña del usuario
     * @param {{Object.atributte}}  email    - email del usuario
     */
    giveValues({username, password, email}){
        this.data = {
            username: username,
            password: password,
            email   : email,
        }
    }

    /**
     * Funcion que toma los valores del usuario y con ellos lo registra en la base de datos
     * de json usando un fetch y el metodo post
     */
    async registerUser(){
            fetch(this.jsonUrl, {method: 'Post',
                body: JSON.stringify({
                    username: this.data.username,
                    password: this.data.password,
                    email:    this.data.email,
                })
            })
    }
    /**
     * Funcion que se encargara de buscar los datos del usuario en la base de datos
     * 
     */
    async checkForUser ({username, password}) {
        fetch(this.jsonUrl, {method: 'Get'})
            .then(response => response.json())
            .then(userArr=>{

                if (userArr.find(userObj => userObj.username === username && userObj.password === password))
                    console.log("encontrado: ")
                    console.log(userArr)
            
            })
    }
    
}

/**
 * Funcion que toma los valores del formulario y devuelve un objeto con sus valores
 * @returns {Object}  userAtributes - objeto con los datos del usuario
 */
const userAtributtes = () =>{
    //pequeño if para que no colapse el codigo en el login al no encontrar un campo de email
    let email = null
        if (document.querySelector("input[type=email]")){
            email = document.querySelector("input[type=email]").value
        }
    let userAtributtes = {
        username: document.querySelector("input[type=text]").value,
        password: document.querySelector("input[type=password]").value,
        email   : email,
    }
    return userAtributtes
}


/**
 * MARK: Botones
 * funcion autoejecutable, que se encarga de asignar funciones a los botones, segun
 * el fichero en el que se haya cargado el js, comprobando los botones que hay con query selector.
 */
(function addFunctionToButtons () {
    console.log("hola")
    if (document.querySelector(".registrarse")) {
        //añade un event listener al boton de registro
        document.querySelector(".registrarse").addEventListener("click", (e)=>{
            // llama a la funcion de registro cuando el boton es pulsado
            e.preventDefault()
            let User = new user(userAtributtes())
            User.registerUser()
        })
    } 
    
    else {
        document.querySelector(".login").addEventListener("click", (e) => {
            e.preventDefault()
            let User = new user()
            User.checkForUser(userAtributtes())
        })
    } 
})()
