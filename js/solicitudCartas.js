




class ListOfCards {
	constructor () {
		let listOfCards

		this.listOfCards = getCards("goblin")
		console.log(this.listOfCards)
	}
}

let listOfCards = new ListOfCards


async function getCards(filter) {
	fetch("https://api.scryfall.com/cards/search?q=" + filter)
		.then((response) => response.json())
		.then((listCards) => listCards)}




const randomCardsAtStart = () => {
	let randomCards = [
		"goblin",
		"slime",
		"squirrel",
		"land",
		"vampire",
		"angel",
		"crab",
		"pirate"
	]
	let randomNumber = Math.floor(Math.random()*2)
	getCards(randomCards[randomNumber])
}

randomCardsAtStart()

document.querySelector(".main__cardList > button").addEventListener("click", ()=>{
	document.querySelector(".main__cardList__cards").innerHTML = ""
})


document.querySelector(".main__aside > button").addEventListener("click", () =>{
	document.querySelector(".main__cardList__cards").innerHTML = ""
	getCards(document.querySelector(".main__aside__include > input").value)
})

function printCard(cardImg) {
	if (cardImg.total_cards >= 0){
		for (const card of cardImg.data) {
			let div = document.createElement("div")
			let img = document.createElement("img");
			if ("image_uris" in card) {
				img.src = card.image_uris.png
			} else {
				continue
			}
			let price = document.createElement("p")
			if (card.prices.usd == null) {
				price.innerHTML = "No price registred"
			} 
			else{
				price.innerHTML = card.prices.usd + "$"
			}
			let cardList = document.querySelector(".main__cardList__cards");
			div.appendChild(img)
			div.appendChild(price)
			cardList.appendChild(div);
		}
	}
	else {
		let img = document.createElement("img");
		let price = document.createElement("p")
		if (cardImg.prices.usd == null) {
			price.innerHTML = "No price registred"
		} 
		else{
			price.innerHTML = cardImg.prices.usd + "$"
		}
			img.src = cardImg.image_uris.png;
			let cardList = document.querySelector(".main__cardList__cards");
			cardList.appendChild(img);
	}

}


function getNameToComplete () 
{
	return document.querySelector(".header__nav__search > input").value
}



async function autocompleteName (nameTocomplete) 
{
	fetch("https://api.scryfall.com/cards/autocomplete?q=" + nameTocomplete)
		.then((response) => response.json())
		.then((listCards) => addAutocompletedNames(listCards));
}



document.getElementById("search").addEventListener("keyup" , ()=>{
	autocompleteName(getNameToComplete())
})




function addAutocompletedNames (listOfNames) 
{
	let datalist = document.querySelector(".header__nav__search > datalist")
	datalist.innerHTML = ""
	for (const name of listOfNames.data) {
		let option = document.createElement("option")
		option.value = name
		datalist.appendChild(option)
	}
}

document.getElementById("search").addEventListener("blur" , ()=>{
	searchCard(document.querySelector(".header__nav__search > input").value)
})


function searchCard (cardName)
{
	fetch("https://api.scryfall.com/cards/named?exact=" + cardName)
		.then((response) => response.json())
		.then((card) => printCard(card));
}


const orderCardsForPrice = (listOfCards, orderType) => {

	let typeOfShort
	if (orderType == "ASC") 
		typeOfShort = listOfCards.data.sort((a, b) => a.prices.usd - b.prices.usd)
	if (orderType == "DES")
		typeOfShort = listOfCards.data.sort((b, a) => a.prices.usd - b.prices.usd)
	let sortedListOfCards = {
		data: typeOfShort,
		total_cards: listOfCards.total_cards,
	}

	return sortedListOfCards
}

// document.querySelector(".main__aside__priceOrder > input:nth-child(1)").addEventListener("click", ()=>{
// 	getCards()
// })