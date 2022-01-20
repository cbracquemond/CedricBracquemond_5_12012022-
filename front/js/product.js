/**
 * Create the product image and append it to the item__img HTMLElement
 * @param {string} imageUrl
 * @param {string} altTxt
 */
function createImage(imageUrl, altTxt) {
	const slot = document.querySelector(".item__img")
	const img = document.createElement("img")
	img.src = imageUrl
	img.alt = altTxt
	slot.appendChild(img)
}

/**
 * Set the product name in the title HTMLHeaderElement
 * @param {string} name
 */
function setTitle(name) {
	const h1 = document.querySelector("#title")
	h1.innerText = name
}

/**
 * Set the price in the price HTMLParagraphElement
 * @param {string} price
 */
function setPrice(price) {
	const p = document.querySelector("#price")
	p.innerText = price
}

/**
 * Set the descritpion in the description HTMLParagraphElement
 * @param {string} description
 */
function setDescription(description) {
	const p = document.querySelector("#description")
	p.innerText = description
}

/**
 * Create all the colors for the product and put them in the colors menu
 * @param {string} colors
 */
function createColors(colors) {
	const menu = document.querySelector("#colors")
	colors.forEach((color) => {
		const option = document.createElement("option")
		option.value = color
		option.innerText = color
		menu.appendChild(option)
	})
}

/**
 * Check if the chosen product is already in the cart with the choosen color,
 * then update the quantity if so, or create it if not
 * @param {object} product
 */
function cartUpdate(product) {
	let cartStorage = []

	//Create the cart key in the localStorage if not already present
	if (localStorage.getItem("cart") === null)
		localStorage.setItem("cart", JSON.stringify(cartStorage))

	cartStorage = localStorage.getItem("cart")
	cartStorage = JSON.parse(cartStorage)

	//Search through the cart if the product is already there with the same
	//color, return the index if so
	const cartUpdate = cartStorage.findIndex(
		(element) => element.key === product.key
	)

	if (cartUpdate === -1) {
		cartStorage.push(product)
	} else {
		cartStorage[cartUpdate].quantity += product.quantity
	}
	localStorage.setItem("cart", JSON.stringify(cartStorage))
}

/**
 * Display the correct product information
 * @param {object} kanap
 */
function constructPage(kanap) {
	const { imageUrl, altTxt, name, price, description, colors } = kanap
	createImage(imageUrl, altTxt)
	setTitle(name)
	setPrice(price)
	setDescription(description)
	createColors(colors)
}

/**
 * Add a click event on the button to check if the color and quantity are filled
 * and then pass the product objet in the local storage if so
 * @param {object} kanap
 */
function buttonClick(kanap) {
	const button = document.querySelector("#addToCart")

	button.addEventListener("click", (e) => {
		const product = {
			id: kanap._id,
			color: document.querySelector("#colors").value,
			quantity: Number(document.querySelector("#quantity").value),
			key: id + document.querySelector("#colors").value,
		}
		if (product.quantity === 0 && product.color === "") {
			alert("Veuillez définir une couleur et une quantité")
			return
		}
		if (product.color === "") {
			alert("Veuillez choisir une couleur")
			return
		}
		if (product.quantity === 0) {
			alert("Veuillez définir une quantité")
			return
		}
		if (product.quantity < 1 || product.quantity > 99) {
			alert("La quantité doit être comprise entre 1 et 99")
			return
		}
		cartUpdate(product)
		alert("le produit a bien été rajouté à votre panier")
	})
}

/**
 * Begin the execution of the page script, by making a request to the API to get the
 * clicked product data, then executing constructPage and buttonClick
 */
function init() {
	const url = new URL(window.location.href)
	const id = url.searchParams.get("id")
	fetch(`http://localhost:3000/api/products/${id}`)
		.then((response) => response.json())
		.then((data) => {
			constructPage(data)
			buttonClick(data)
		})
		.catch((reject) => console.log(reject))
}

init()
