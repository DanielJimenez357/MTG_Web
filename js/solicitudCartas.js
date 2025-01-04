/**
 * MARK: getCards
 * funcion para obtener una lista de cartas desde la API de Scryfall segun un filtro
 * @param 	{string} filter 	- filtro para buscar cartas en la API
 * @returns {Promise<Array>} 	- devuelve un array de objetos de cartas
 */
async function getCards(filter) {
    const response = await fetch(
        "https://api.scryfall.com/cards/search?q=" + filter
    );
    const data = await response.json();
    return data.data;
}

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
        this.listOfCards = [];
        this.init(); //metodo init para asegurarnos de que se tiene las cartas antes de mostrarlas
        this.utilitiesToButtons();
    }

    /**
     * inicializa la lista de cartas con una selección aleatoria al inicio
     */
    async init() {
        this.listOfCards = await getCards(await randomCardsAtStart());
            this.printCard(this.listOfCards);
    }

    /**
     * configura eventos para los botones y elementos interactivos
     */
    utilitiesToButtons() {
        document
            .querySelector(".main__cardList > button")
            .addEventListener("click", () => {
                document.querySelector(".main__cardList__cards").innerHTML = "";
            });



        let searchInput = document.getElementById("search");

        searchInput.addEventListener("keyup", () => {
            autocompleteName(
                document.querySelector(".header__nav__search > input").value
            );
        });

        searchInput.addEventListener("enter", () => {
            searchCard(document.querySelector(".header__nav__search > input").value);
        });


        searchInput.addEventListener("focus", () => {
            let searchOptions = document.querySelector("#cardsOptions");
            searchOptions.style.display = "flex";
        });

        let priceOrder = document.querySelector(".main__aside__priceOrder")
		

		let startFilteredSearch = document.querySelector(".main__aside__search").addEventListener("click" , ()=>{
            
            filterCards(getFilters())

		})
    }

    /**
     * cambia la lista de cartas actual y la imprime
     * @param {Array} newListOfCards - nueva lista de cartas
     */
    changeCards(newListOfCards, priceOrder) {
        this.placeForCards.innerHTML = ""
        this.listOfCards = newListOfCards;
        this.printCard(this.listOfCards, priceOrder);
    }

    /**
     * Imprime una lista de cartas o una carta individual con un retardo
     * @param {Array|Object} arrOfCards - lista de cartas o una carta
     */
    printCard(arrOfCards, priceOrder) {

        if (arrOfCards[Symbol.iterator]) { //utilizamos el symbol.iterator para comprobar si el objeto es iterable
            let delay = 0;
            for (const card of orderCardsForPrice(arrOfCards, priceOrder)) {
                setTimeout(() => {
                    this.placeForCards.appendChild(makeDomOfCard(card));
                }, delay);
                delay += 50;
            }
        } else {
            this.placeForCards.appendChild(makeDomOfCard(arrOfCards));
        }
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
        "pirate",
    ];
    return randomCards[Math.floor(Math.random() * randomCards.length)];
}

/**
 * MARK: makeDomOfCard
 * crea un nodo DOM a partir de un objeto de carta
 * @param 	{Object} card 	- objeto de carta con información
 * @returns {HTMLElement} 	- nodo DOM representando la carta
 */
const makeDomOfCard = (card) => {
    let div = document.createElement("div");
    let loading = document.createElement("div")
    let img = document.createElement("img");
    let price = document.createElement("p");
    price.style.display = "none"
    img.style.display = "none"
    loading.style.display = "block"
    loading.style.display = "block"
    img.src = card.image_uris.png;
    img.addEventListener("load", ()=>{
        loading.style.display = "none"
        img.style.display = "block"
        price.style.display = "block"
    })
    price.innerHTML = card.prices.usd ? card.prices.usd + "$" : "No price registered";
    div.appendChild(img);
    div.appendChild(price);
    div.appendChild(loading);
    return div;
};

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
    fetch("https://api.scryfall.com/cards/named?exact=" + cardName)
        .then((response) => response.json())
        .then((card) => listOfCards.printCard(card));
}

/**
 * MARK: orderCardsForPrice
 * ordena una lista de cartas por precio en orden ascendente o descendente
 * @param 	{Array} 	listOfCards - lista de cartas a ordenar
 * @param 	{string} 	orderType 	- tipo de orden ("ASC" o "DES")
 * @returns {Array} 				- lista de cartas ordenadas
 */
const orderCardsForPrice = (listOfCards, orderType="DES") => {
    let typeOfSort = [];
    if (orderType === "ASC") {
        typeOfSort = listOfCards.sort((a, b) => a.prices.usd - b.prices.usd);
    } else if (orderType === "DES") {
        typeOfSort = listOfCards.sort((b, a) => a.prices.usd - b.prices.usd);
    }
    return typeOfSort;
};


/**
 * MARK: getFilters
 */

const getFilters = () =>{
    let filters = {
        priceOrder: null,
        expansion: "",
        manaCost: "",
    }
    if (document.querySelector(".main__aside__priceOrder__radio:checked")) {
        let checkedRadioButton = document.querySelector(".main__aside__priceOrder__radio:checked")
        filters.priceOrder = checkedRadioButton.value
    }

    filters.expansion = document.querySelector(".main__aside__expansion > input").value

    filters.manaCost = document.querySelector(".main__aside__manaValue > input").value

    return filters
}


/**
 * MARK: filterCards
 */

const filterCards = ({priceOrder, expansion, manaCost}) =>{
    let url = "https://api.scryfall.com/cards/search?q="
    if(expansion !== "")
        url += "e:" + expansion
    if(manaCost !== "")
        url += "+cmc=" + manaCost
    console.log(url)
    fetch(url)
        .then((response) => response.json())
        .then((listCards) => listOfCards.changeCards(listCards.data, priceOrder));
}


