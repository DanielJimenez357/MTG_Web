

async function getCards(filter) {
	fetch("https://api.scryfall.com/cards/search?q=squirrel")
		.then((response) => response.json())
		.then((listCards) => printCard(listCards));
}

function printCard(cardImg) {
	if (cardImg.total_cards >= 0){
		for (const card of cardImg.data) {
			let div = document.createElement("div")
			let img = document.createElement("img");
			img.src = card.image_uris.png;
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

getCards();


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