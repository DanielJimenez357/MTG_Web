
/**
 * MARK: Clase user
 * Clase para gestionar los datos de los usuarios el login y registro
 */
class user {

    JSONURL = "http://localhost:3000/users"; // URL a la que se le harán las consultas
    data;

    /**
     * Crea el objeto que usará la clase para la gestión del usuario
     * @param {{Object.atributte}} username - nombre del usuario
     * @param {{Object.atributte}} password - contraseña del usuario
     * @param {{Object.atributte}} email    - email del usuario
     */
    giveValues({ username, password, email }) {
        this.data = {
            username: username,
            password: password,
            email: email,
            cart: [],
        };
    }

    /**
     * Función que toma los valores del usuario y con ellos lo registra en la "base de datos"
     * de JSON usando un fetch y el método POST
     */
    async registerUser() {
            fetch(this.JSONURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.data),
            });

    }

    /**
     * Función que busca en la base de datos la existencia del usuario junto a su contraseña pasados por parámetro
     * @param {{Object.atributte}} username - nombre del usuario
     * @param {{Object.atributte}} password - contraseña de usuario
     */
    async checkForUser({ username, password }) {
            let response = await fetch(this.JSONURL, { method: 'GET' });
            let userArr = await response.json();
            let userFound = userArr.find(
                (userObj) => userObj.username === username && userObj.password === password
            );

            if (userFound) {
                let generatedToken = Math.random().toString(36).substring(2)
                localStorage.setItem("token", generatedToken)
                this.data = userFound; // Actualizamos el objeto `data` con los datos del usuario encontrado
                localStorage.setItem("email", this.data.email );
                location.replace('paginaPrincipal.html'); // Redirige a la sección de la página principal
            } else {
                alert('Usuario o contraseña incorrectos.');
                
                if (localStorage.getItem("Intentos")){
                    let intentos = parseInt(localStorage.getItem("Intentos"))
                    if(intentos>0){
                        localStorage.setItem("Intentos", --intentos)
                    }
                    else{
                        let date = new Date()
                        localStorage.setItem("banTime", date)
                        checkBan()
                    }
                }
                else {
                    localStorage.setItem("Intentos", 4)
                }
            }
    }
}


/**
 * MARK: userAtributtes
 * Función que toma los valores del formulario y devuelve un objeto con sus valores
 * @returns {Object} userAtributes - objeto con los datos del usuario
 */
const userAtributtes = () => {
    // Pequeño if para que no colapse el código en el login al no encontrar un campo de email
    let email = null;
    if (document.querySelector('input[type=email]')) {
        email = document.querySelector('input[type=email]').value;
    }
    return {
        username: document.querySelector('input[type=text]').value,
        password: document.querySelector('input[type=password]').value,
        email: email,
    };
};

/**
 * MARK: Botones
 * Función autoejecutable, que se encarga de asignar funciones a los botones, según
 * el fichero en el que se haya cargado el JS, comprobando los botones que hay con query selector.
 */
(function addFunctionToButtons() {
    if (document.querySelector('.registrarse')) {
        // Añade un event listener al botón de registro
        document.querySelector('.registrarse').addEventListener('click', (e) => {
            // Llama a la función de registro cuando el botón es pulsado
            e.preventDefault();
            User.giveValues(userAtributtes());
            User.registerUser();
        });
    }

    if (document.querySelector('.login')) {
        document.querySelector('.login').addEventListener('click', (e) => {
            e.preventDefault();
            User.checkForUser(userAtributtes());
        });
    }
})();

const checkBan = () => {
    if (localStorage.getItem("banTime")) {
        let dateOfBan = new Date(localStorage.getItem("banTime"))
        let actualTime = new Date
        if (actualTime - dateOfBan < 300000){
            document.querySelector("body").innerHTML = "Cuenta bloqueada, espere 5 minutos y recargue la pagina"
        } else {
            localStorage.removeItem("banTime")
            localStorage.setItem("Intentos", 4)
        }
    }
}

checkBan()


export let User = new user();

