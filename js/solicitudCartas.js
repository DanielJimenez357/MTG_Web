
/**
 * MARK: Clase ListOfCards
 * clase para gestionar la lista de cartas mostradas en la aplicación
 */
class ListOfCards {
	/**
	 * constructor de la clase
	 * inicializa propiedades y configura botones
	 */
	constructor() {
		this.placeForCards = document.querySelector(".main__cardList__cards");
		this.init(); //metodo init para asegurarnos de que se tiene las cartas antes de mostrarlas
		this.actualPage = 0;
		this.pagesReaded = 0;
		this.library = {
			cards: [],
			pages: 0,
			priceOrder: "DES",
			expansion: "",
			manaCost: "",
		};
		this.utilitiesToButtons();
	}

	/**
	 * MARK:init
	 * inicializa la lista de cartas con una selección aleatoria al inicio
	 */
	async init() {
		let firstCards = await getConteiningCards(await randomCardsAtStart());
		this.storeCards(firstCards);
	}

	/**
	 * MARK:utilitiesToButtons
	 * configura eventos para los botones y elementos interactivos
	 */
	utilitiesToButtons() {
		//detectar cuando dejamos de escribir en la barra de busqueda
		let searchInput = document.getElementById("search");
		searchInput.addEventListener("keyup", () => {
			autocompleteName(
				document.querySelector(".header__nav__search > input").value
			);
		});
		searchInput.addEventListener("focus", () => {
			let searchOptions = document.querySelector("#cardsOptions");
			searchOptions.style.display = "flex";
		});
		document
			.querySelector(".main__aside__search")
			.addEventListener("click", () => {
				getFilteredCards(this.getFilters());
			});
		let divPages = document.querySelector(".main__cardList__pages");
		divPages.children[0].addEventListener("click", () => {
			if (this.actualPage > 0) {
				arrowAnimation()
				--this.actualPage;
				this.changeCards();
				document.querySelector(".main__cardList__pages__actual").innerHTML =
					listOfCards.actualPage + 1;
			}
		});
		divPages.children[4].addEventListener("click", () => {
			if (this.actualPage < this.library.pages - 1) {
				arrowAnimation()
				++this.actualPage;
				this.changeCards();
				document.querySelector(".main__cardList__pages__actual").innerHTML =
					listOfCards.actualPage + 1;
			}
		});


		document.querySelector(".main__aside__include__button").addEventListener("click", async ()=>{
			this.library.cards = [];
			this.library.pages = 0;
			this.actualPage = 0;
			this.pagesReaded = 0;
			this.getFilters()
			let word = document.querySelector(".main__aside__include").children[1].value
			this.storeCards(await getConteiningCards(word))
		})
	}

	/**
	 * MARK:changeCards
	 * cambia la lista de cartas actual y la imprime
	 */
	changeCards() {
		arrowAnimation() //animacion de flecha en movimiento
		this.placeForCards.innerHTML = "";
		this.printCard();
	}

	/**
	 * MARK:printCard
	 * Imprime una lista de cartas o una carta individual con un retardo
	 */
	printCard() {
		let arrOfCards = this.library.cards[this.actualPage];
		if (arrOfCards[Symbol.iterator]) {
			//utilizamos el symbol.iterator para comprobar si el objeto es iterable
			let delay = 0;
			for (const card of arrOfCards) {
				setTimeout(() => { //retardo
					this.placeForCards.appendChild(makeDomOfCard(card));
				}, delay);
				delay += 50;
			}
		} else {
			this.placeForCards.appendChild(makeDomOfCard(arrOfCards));
		}
		setTimeout(cardAnimation, 3200) //animaciones cuando se hayan mostrado todas las cartas por eso 3200
	}

	/**
	 * 
	 * @param {url} requestNoSort	-	datos sin filtrar listos para ser procesados
	 * @param {*} recursive 		-	comprobar si es la primera o ultima vez que se llama a la funcion en un bucle
	 * @param {*} url 				-	url de la proxima request
	 */

	storeCards = (requestNoSort, recursive = false, url = null) => {

		if (!recursive && !url) { //que se ejecute solo en la ultima ejecucion
			document.querySelector(".main__cardList__searchAnimation").style.display = "none"
			this.library.cards = [...this.library.cards, ...requestNoSort.data]
			this.packageCards(this.orderCardsForPrice())
			this.changeCards();
			this.updatePagination()
		} else {
			this.library.cards = [...this.library.cards, ...requestNoSort.data]
			getFilteredCards(recursive, url, true);
		}
	};


	/**
	 * actualizacion del numero de paginas
	 */
	updatePagination = () => {
		if (this.library.pages > 1) {
			document.querySelector(".main__cardList__pages__actual").innerHTML = listOfCards.actualPage + 1;
			document.querySelector(".main__cardList__pages__number").innerHTML = this.library.pages;
			document.querySelector(".main__cardList__pages").style.display = "block"
		}
	}

	/**
	 * MARK: orderCardsForPrice
	 * ordena una lista de cartas por precio en orden ascendente o descendente
	 * @returns {Array}		-	array con las cartas ordenadas
	 */
	orderCardsForPrice = () => {
		let cardsToSort = this.library.cards
		let orderType = this.library.priceOrder;
		if (orderType === "ASC") {
			cardsToSort = cardsToSort.sort((a, b) => a.prices.usd - b.prices.usd);
		} else if (orderType === "DES") {
			cardsToSort = cardsToSort.sort((b, a) => a.prices.usd - b.prices.usd );
		}
		return cardsToSort		
	};

	/**
	 * MARK: getFilters
	 * funcion para poner los filtros de la actual request
	 */
	getFilters = () => {
		if (document.querySelector(".main__aside__priceOrder__radio:checked")) {
			let checkedRadioButton = document.querySelector(
				".main__aside__priceOrder__radio:checked"
			);
			this.library.priceOrder = checkedRadioButton.value;
		}
		this.library.expansion = document.querySelector(
			".main__aside__expansion input"
		).value;
		this.library.manaCost = document.querySelector(
			".main__aside__manaValue input"
		).value;
	};


	/**
 * MARK: packageCards
 * funcion para empacar dentro de un array otros arrays que contengan
 * 64 cartas cada uno para facilitar su manejo
 * @param {*} listOfCards 
 */
	packageCards = (listOfCards) =>{
	let counter = 0;
	let stackNumber = 64
	let stackedCards = []
	while (counter<listOfCards.length){
		stackedCards.push(listOfCards.slice(counter, counter+stackNumber))
		counter += stackNumber
		++this.library.pages 
	}
	this.library.cards = stackedCards
}
}

// inicializa la clase principal
let listOfCards = new ListOfCards();

/**
 * MARK: randomCardsAtStart
 * devuelve una palabra aleatoria para iniciar la busqueda de cartas
 * @returns {string} - nombre aleatorio de una categoria de cartas
 */
function randomCardsAtStart() {
	let randomCards = [
		"goblin",
		"slime",
		"squirrel",
		"land",
		"vampire",
		"angel",
		"crab",
	];
	return randomCards[Math.floor(Math.random() * randomCards.length)];
}

/**
 * MARK: getConteiningCards
 * funcion para obtener una lista de cartas desde la API de Scryfall segun un filtro
 * @param 	{string} filter 	- filtro para buscar cartas en la API
 * @returns {Promise<Array>} 	- devuelve un array de objetos de cartas
 */
async function getConteiningCards(filter) {
	listOfCards.placeForCards.innerHTML = ""
	document.querySelector(".main__cardList__searchAnimation").style.display = "block"
	const response = await fetch(
		"https://api.scryfall.com/cards/search?q=" + filter
	);
	const data = await response.json();
	return data;
}

/**
 * MARK: makeDomOfCard
 * crea un nodo DOM a partir de un objeto de carta
 * @param 	{Object} card 	- objeto de carta con información
 * @returns {HTMLElement} 	- nodo DOM representando la carta
 */
const makeDomOfCard = (card) => {
	let div = document.createElement("div");
	let loading = document.createElement("div");
	let img = document.createElement("img");
	let price = document.createElement("p");
	price.style.display = "none";
	img.style.display = "none";
	loading.style.display = "block";
	
	let imgInfo
	try {
		imgInfo = img.src = card.image_uris.png;
	} catch (error) {
		imgInfo = img.src = card.card_faces[0].image_uris.png;
	}
	
	return fillCardInformation(div, card, imgInfo, img, loading, price);
};


/**
 * MARK: fillCardInformation
 * 
 * Maneja la informarcion mostrada en el aside cuando se pincha en una carta
 * ademas de la logica para ello
 * 
 * @param {*} div 
 * @param {*} card 
 * @param {*} imgInfo 
 * @param {*} img 
 * @param {*} loading 
 * @param {*} price 
 * @returns {HTML}		-	div con toda la informacion preparada
 */
function fillCardInformation(div, card, imgInfo, img, loading, price) {
	div.setAttribute("tabindex", "0");
	let cardInfoDom = document.querySelector(".main__cardInformation");
	let cardInfoButton = cardInfoDom.querySelector("button");

	div.addEventListener("focus",  putDataInDOM());

        
	document.querySelector(".main__cardInformation__arrow").addEventListener("click", () => {
		document.querySelector(".main__cardInformation").style.transform = "translateX(-1000px)";
	});
	{
		img.addEventListener("load", () => {
			loading.style.display = "none";
			img.style.display = "block";
			price.style.display = "block";
		});
		price.innerHTML = card.prices.usd
			? card.prices.usd + "$"
			: "No price registered";
		div.appendChild(img);
		div.appendChild(price);
		div.appendChild(loading);
		return div;
	}



	function putDataInDOM() {
		return () => {
			//propiedades de la carta a DOM
			cardInfoDom.children[1].src = imgInfo;
			cardInfoDom.children[2].innerHTML = card.name;
			cardInfoDom.children[3].innerHTML = card.prices.usd + "$" || "No price resgistred";
			cardInfoDom.children[4].innerHTML = card.artist;
			cardInfoDom.children[5].innerHTML = card.rarity;
			cardInfoDom.children[6].innerHTML = card.colors;
			cardInfoDom.children[7].innerHTML = card.type_line;
			cardInfoDom.children[8].innerHTML = card.set_name;
			cardInfoDom.children[9].innerHTML = card.oracle_text;
			cardInfoDom.children[10].innerHTML = card.flavor_text;
			cardInfoDom.children[11].innerHTML = card.keywords;
			document.querySelector(".main__cardInformation").style.transform = "translateX(0)";


			cardInfoButton.addEventListener("click", getDataToCart(), {once:true});
		};
	}

	/**
	 * añade al almacenamiento local la carta seleccionada
	 */
	function getDataToCart() {
		return () => {
			// Recuperar los datos actuales de la carta mostrada
			const imgInfo = cardInfoDom.children[1].src;
			const cardName = cardInfoDom.children[2].textContent;
			const cardPrice = cardInfoDom.children[3].innerHTML;

			const boughtCard = {
				cardImage: imgInfo,
				cardName: cardName,
				cardPrice: cardPrice,
			};
			cartToLocalStorage(boughtCard);
		};
	}
}

/**
 * MARK: autocompleteName
 * realiza una solicitud para obtener nombres de cartas autocompletados
 * @param {string} nameToComplete - nombre parcial para autocompletar
 */
async function autocompleteName(nameToComplete) {
	fetch("https://api.scryfall.com/cards/autocomplete?q=" + nameToComplete)
		.then((response) => response.json())
		.then((listCards) => addAutocompletedNames(listCards));
}

/**
 * MARK: addAutocompletedNames
 * muestra los nombres autocompletados en una lista interactiva
 * @param {Array} listOfNames - lista de nombres autocompletados
 */
function addAutocompletedNames(listOfNames) {
	let div = document.querySelector("#cardsOptions");
	div.innerHTML = "";
	for (const name of listOfNames.data) {
		let option = document.createElement("p");
		option.innerHTML = name;
		option.addEventListener("click", () => {
			searchCard(option.innerHTML);
			document.querySelector("#cardsOptions").style.display = "none";
		});
		div.appendChild(option);
	}
}

/**
 * MARK: searchCard
 * busca una carta específica y la imprime
 * @param {string} cardName - nombre exacto de la carta
 */
async function searchCard(cardName) {
	const response = await fetch("https://api.scryfall.com/cards/named?exact=" + cardName)
	const card = await response.json()
	listOfCards.library.cards = [card]
	listOfCards.placeForCards.innerHTML = ""
	listOfCards.printCard()
}

/**
 * MARK: getFilteredCards
 */

async function getFilteredCards(recursive = false, nextPage) {
	let url;
	if (!recursive) {
		listOfCards.placeForCards.innerHTML = ""
		document.querySelector(".main__cardList__searchAnimation").style.display = "block"

		listOfCards.library.cards = [];
		listOfCards.library.pages = 0;
		listOfCards.actualPage = 0;
		listOfCards.pagesReaded = 0;



		url = "https://api.scryfall.com/cards/search?q=";
		if (listOfCards.library.expansion !== "") url += "e:" + listOfCards.library.expansion;
		if (listOfCards.library.manaCost !== "") url += "+cmc=" + listOfCards.library.manaCost;
	}
	else {
		url = nextPage
	}

	const response = await fetch(url);
	const data = await response.json();


	if (response.ok) {
		if (!recursive) {

			listOfCards.library.pages = Math.ceil(data.total_cards / 64)
		}
		listOfCards.storeCards(data, data.has_more, data.next_page);
	}
}


/**
 * MARK: cardAnimation
 * Animacion para las cartas
 */


const cardAnimation = () => {
	document.querySelectorAll(".main__cardList__cards > div").forEach((card) => {
		const image = card.querySelector("img"); 
		
        if (image) {
			image.addEventListener("mousemove", (event) => {
				const rect = image.getBoundingClientRect();
				const x = event.clientX - rect.left; 
				const y = event.clientY - rect.top; 
				
				const centerX = rect.width / 2;
				const centerY = rect.height / 2;
				const maxTilt = 40;
				
				const tiltX = ((y - centerY) / centerY) * maxTilt; 
				const tiltY = ((x - centerX) / centerX) * -maxTilt;

				image.style.zIndex = "10"
				
				image.style.transform = `perspective(1500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.6)`;
			});
    
		image.addEventListener("mouseleave", () => {
			image.style.zIndex = "0"

			image.style.transform = "perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1)";
			});
        }
    });
    
}


/**
 * MARK: arrowAnimation
 */
const arrowAnimation = () => {
	const ARROW = document.querySelector(".main__cardList__arrow")
	const SCROLL = document.querySelector(".main__cardList__cards")
	ARROW.style.display = "block"
	SCROLL.addEventListener("scrollend", () =>{
		ARROW.style.display = "none"
	})
}


/**
 * MARK: cartToLocalStorage
 * @param {*} card 
 */
const cartToLocalStorage = (card) => {
    let cardsInCart = localStorage.getItem("Cart");

    cardsInCart = cardsInCart ? JSON.parse(cardsInCart) : [];

    const existingCardIndex = cardsInCart.findIndex(
        (cartItem) => cartItem.card.cardName === card.cardName
    );

    if (existingCardIndex !== -1) {
        cardsInCart[existingCardIndex].quantity += 1;
    } else {
        cardsInCart.push({
            card: card,
            quantity: 1,
        });
    }

    localStorage.setItem("Cart", JSON.stringify(cardsInCart));
};

