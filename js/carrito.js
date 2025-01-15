// importamos el objeto user desde el archivo login.js
import {User} from '../js/login.js'
// inicializamos emailjs con el id del servicio
emailjs.init("gIOp9icHly_pLA6oJ")

/**
 * MARK: showCart
 * Esta funcion se encarga de mostrar los productos que hay en el carrito
 * obtenidos desde el localStorage, ademas de calcular el precio total.
 */
const showCart = () =>{
	let cart = JSON.parse(localStorage.getItem("Cart"))
	let products = document.querySelector(".products")

	let list = document.querySelector(".list")
	// limpiamos la lista antes de añadir los nuevos productos
	list.innerHTML =""
	// recorremos el carrito y creamos un elemento por cada producto
	cart.forEach(element => {
		let row 
		row = printCartElements(element)
		list.appendChild(row)
	});

	getPriceTotal()
	products.appendChild(list)
}

/**
 * MARK: printCartElements
 * Esta funcion crea un elemento html para cada producto del carrito,
 * incluyendo la imagen, nombre, precio y cantidad. Ademas de los botones
 * para incrementar o decrementar la cantidad.
 */
const printCartElements = ({card, quantity}) => {

	let row = document.createElement("div")
	let img = document.createElement("img")
    img.src = card.cardImage
	let name = document.createElement("p")
    name.innerHTML = card.cardName
	let price = document.createElement("p")
    price.innerHTML = card.cardPrice
	let quantityOf = document.createElement("p")
	quantityOf.innerHTML = "Cantidad: " + quantity

	let plusQuantity = document.createElement("button")
	let minusQuantity = document.createElement("button")

	plusQuantity.innerHTML = "+";
    plusQuantity.addEventListener("click", () => {
        updateCartItemQuantity(card.cardName, 1); 
        showCart(); 
    });

	minusQuantity.innerHTML = "-";
    minusQuantity.addEventListener("click", () => {
        updateCartItemQuantity(card.cardName, -1);
        showCart(); 
    });

	// agregamos todos los elementos a la fila (row)
	row.appendChild(img)
	row.appendChild(name)
	row.appendChild(price)
	row.appendChild(quantityOf)
	row.appendChild(plusQuantity)
	row.appendChild(minusQuantity)

	return row
}

/**
 * MARK: updateCartItemQuantity
 * Esta funcion actualiza la cantidad de un producto en el carrito,
 * agregando o eliminando el producto segun sea necesario
 */
const updateCartItemQuantity = (cardName, change) => {
    let cart = JSON.parse(localStorage.getItem("Cart"));

    let itemIndex = cart.findIndex((item) => item.card.cardName === cardName);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem("Cart", JSON.stringify(cart));
    }
};

/**
 * MARK: getPriceTotal
 * Esta funcion calcula el precio total del carrito y lo muestra en la pagina
 */
const getPriceTotal = () =>{
	let cart = JSON.parse(localStorage.getItem("Cart"))

	let totalSum = 0

	cart.forEach(element => {
		totalSum += parseFloat(element.card.cardPrice) * element.quantity
	});

	document.querySelector("span").innerHTML = totalSum
}

/**
 * MARK: Envio de email
 * Cuando el boton en el main es presionado, se envia un email con la confirmacion
 * del pedido usando emailjs.
 */
document.querySelector("main button").addEventListener("click", ()=>{
	// llamamos a la funcion para enviar el email
	sendEmail()
})

/**
 * MARK: sendEmail
 * Esta funcion usa emailjs para enviar un email con los datos del usuario,
 * informando sobre la confirmacion del pedido.
 */
const sendEmail = () => {
	// creamos el objeto con los datos del usuario
	let emailData = {
		userName: User.data.userName,
		userEmail: User.data.userEmail,
	}

	emailjs.send("service_wjk7bk5", "template_qre64xr", emailData)	
	alert("Se ha enviado una confirmacion de su pedido al correo")
}

// llamamos a la funcion para mostrar el carrito
showCart()
