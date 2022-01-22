let cart = []

/**
 * search in the data the object corresponding to the item in the cart
 * @param {object} item
 * @param {array} data
 * @returns {object} kanap
 */
function findKanap(item, data) {
	const kanap = data.find((element) => element._id === item.id)
	return kanap
}

/**
 * Create a cart array : each product object in it is a pair with the localStorage element 
 * and it's data in the api
 * @param {array} data
 * @returns {array} cart
 */
function getItems(data) {
	const cart = []
	let cartStorage = JSON.parse(localStorage.getItem("cart"))

	//catch error if cart empty or not created in localStorage before loading
	try {
		cartStorage.forEach((item) => {
            const product = {
                item: item,
                kanap: findKanap(item, data)
            }
			cart.push(product)
		})
	} catch (error) {
		console.log(error)
		console.log("Cart not created")
	}
	return cart
}


/**
 *  create the Article HTMLElement
 * @param {object} product
 * @param {object} product.item
 * @param {string} item.color
 * @param {string} item.id
 * @param {string} item.key	
 * @param {number} item.quantity
 * @returns {HTMLElement} article
 */
function createArticle(product) {
	const article = document.createElement("article")
	article.classList.add("cart__item")
	article.dataset.id = product.item.id
	article.dataset.color = product.item.color
	return article
}

/**
 * Create the div containing the product image, then the image, and put the image in the div
 * @param {object} product
 * @param {object} product.kanap
 * @param {object} kanap.colors
 * @param {object} kanap._id
 * @param {object} kanap.name
 * @param {object} kanap.price
 * @param {object} kanap.imageUrl
 * @param {object} kanap.description
 * @param {object} kanap.altTxt
 * @returns {HTMLElement} slot
 */
function createImage(product) {
	const slot = document.createElement("div")
	const image = document.createElement("img")

	slot.classList.add("cart__item__img")
	image.src = product.kanap.imageUrl
	image.alt = product.kanap.altTxt
	slot.appendChild(image)

	return slot
}

/**
 * Create a div HTMLElement
 * @returns {HTMLElement} content
 */
function createItemContent() {
	const content = document.createElement("div")
	content.classList.add("cart__item__content")
	return content
}

/**
 * Create the itemDescription div, then the name,
 * price and color of the item, and append them to the description
 * @param {object} product
 * @param {object} product.item
 * @param {string} item.color
 * @param {string} item.id
 * @param {string} item.key
 * @param {number} item.quantity
 * @param {object} product.kanap
 * @param {object} kanap.colors
 * @param {object} kanap._id
 * @param {object} kanap.name
 * @param {object} kanap.price
 * @param {object} kanap.imageUrl
 * @param {object} kanap.description
 * @param {object} kanap.altTxt
 * @returns {HTMLElement} description
 */
function createItemDescription(product) {
	const h2 = document.createElement("h2")
	const color = document.createElement("p")
	const price = document.createElement("p")
	const description = document.createElement("div")

	description.classList.add("cart__item__content__description")
	h2.innerText = `${product.kanap.name}`
	color.innerText = `${product.item.color}`
	price.innerText = `${product.kanap.price} €`

	description.appendChild(h2)
	description.appendChild(color)
	description.appendChild(price)

	return description
}

/**
 * Create a HTMLParagraphElement displaying the text "Qté :"
 * @returns {HTMLParagraphElement} qte
 */
function createQte() {
	const qte = document.createElement("p")
	qte.innerText = "Qté : "
	return qte
}

/**
 * Create the input HTMLInputElement and set its attributes
 * @param {object} product
 * @param {object} product.item
 * @param {string} item.color
 * @param {string} item.id
 * @param {string} item.key
 * @param {number} item.quantity
 * @returns {HTMLInputElement} input
 */
function createInput(product) {
	const input = document.createElement("input")
	input.type = "number"
	input.classList.add("itemQuantity")
	input.name = "itemQuantity"
	input.min = 1
	input.max = 100
	input.value = product.item.quantity
	return input
}

/**
 * Create the quantity div, and append it the Qte HTMLParagraphElement and
 * the input HTMLInputElement
 * @param {object} product
 * @returns {HTMLElement} quantity
 */
function createQuantity(product) {
	const input = createInput(product)
	const quantity = document.createElement("div")
	quantity.classList.add("cart__item__content__settings__quantity")
	quantity.appendChild(createQte())
	quantity.appendChild(input)
	return quantity
}

/**
 * Create the deleteDiv HTMLElement and the deleteItem HTMLParagraphElement
 * and append the latter to the former
 * @returns {HTMLElement} deleteDiv
 */
function createDeleteDiv() {
	const deleteDiv = document.createElement("div")
	const deleteItem = document.createElement("p")
	deleteDiv.classList.add("cart__item__content__settings__delete")
	deleteItem.innerText = "Supprimer"
	deleteDiv.appendChild(deleteItem)
	return deleteDiv
}

/**
 * Loop through the cart to create the totalQuantity and totalPrice and put them in their
 * HTMLElement as innerText
 */
function createTotal() {
	let totalQuantity = 0
	let totalPrice = 0

	cart.forEach((product) => {
		totalQuantity += product.item.quantity
		totalPrice += product.item.quantity * product.kanap.price
	})

	document.querySelector("#totalQuantity").innerText = totalQuantity
	document.querySelector("#totalPrice").innerText = totalPrice
}

/**
 * Create the setting HTMLElement, and append to it the quantity and deleteDiv HTMLElement
 * @param {object} product
 * @returns {HTMLElement} setting
 */
function createItemSetting(product) {
	const setting = document.createElement("div")
	setting.classList.add("cart__item__content__settings")
	setting.appendChild(createQuantity(product))
	setting.appendChild(createDeleteDiv())
	return setting
}

/**
 * Check if the cart is empty, then return a boolean to allow or block the execution of the
 * submitOrder function
 * @returns {boolean}
 */
function checkCart() {
	if (cart.length === 0) {
		alert("Votre panier est vide!")
		return true
	}
}

/**
 * Check if all the form input are filled, then return a false to checkForm if not
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function checkCompletion(form) {
	const inputs = form.querySelectorAll("input")
	for (let index = 0; index < inputs.length; index++) {
		const input = inputs[index]
		if (input.value === "") {
			alert("Veuillez remplir tout les champs!")
			return false
		}
	}
	return true
}

/**
 * Loop through all the form inputs, to check if they are correct by testing them
 * against a regex and displaying an error message if not valid. If either of the
 * inputs is not valid, return a false to checkForm
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function checkValues(form) {
	const inputs = form.querySelectorAll(".cart__order__form__question input")
	const regexList = new Map()
	let isChecked = []

	regexList.set("firstName",/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/)
	regexList.set("lastName",/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/)
	regexList.set("address", /^.*$/)
	regexList.set("city", /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/)
	regexList.set("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/)

	for (let index = 0; index < inputs.length; index++) {
		const input = inputs[index]
		const errorMsg = document.querySelector(`#${input.id}ErrorMsg`)
		const label = input
			.closest(".cart__order__form__question")
			.querySelector("label").innerText
		const newLabel = label.replace(":", "")
		const regex = regexList.get(`${input.id}`)

		if (!regex.test(input.value)) {
			errorMsg.innerText = `Votre ${newLabel} est invalide!`
			isChecked.push(false)
		}
		//Delete a previous error message if an inputs was wrong and is corrected
		if (regex.test(input.value)) errorMsg.innerText = ""
	}
	if (isChecked.length != 0) return false
	return true
}

/**
 * Loop through the cart to create an array of each product ID
 * @returns {array} products
 */
function createProductsArray() {
	let products = []
	cart.forEach((product) => {
		products.push(product.item.id)
	})
	return products
}

/**
 * Execute both checkCompletion and checkValues, then test if either of them if
 * true, then return a boolean to allow or block the execution of the
 * submitOrder function
 * @param {HTMLFormElement} form
 * @returns boolean
 */
function checkForm(form) {
	if (!checkCompletion(form) || !checkValues(form)) return false
	return true
}

/**
 * Create the body of the POST request for submitOrder by taking the
 * value of each element of the form to put them in thecontact object,
 * the result of createProductArray to create the products array
 * @param {HTMLFormElement} form
 * @returns {object} body
 */
function makeRequestBody(form) {
	const body = {
		contact: {
			firstName: `${form.elements.firstName.value}`,
			lastName: `${form.elements.lastName.value}`,
			address: `${form.elements.address.value}`,
			city: `${form.elements.city.value}`,
			email: `${form.elements.email.value}`,
		},
		products: createProductsArray(),
	}
	return body
}

/**
 * Target the cart__item section, and call all the relevant function
 * to create and append all the necessary elements to it
 * @param {object} product
 * @param {object} product.item
 * @param {object} product.kanap
 */
function createProducts(product) {
	const section = document.querySelector("#cart__items")
	const article = createArticle(product)
	const content = createItemContent()

	section.appendChild(article)
	article.appendChild(createImage(product))
	article.appendChild(content)
	content.appendChild(createItemDescription(product))
	content.appendChild(createItemSetting(product))
}

/**
 * Make an eventListener for each "supprimer" div, which delete the item
 * from the cart page, the cart, the localStorage
 * @param {object} product
 * @param {object} product.item
 * @param {string} item.color
 * @param {string} item.id
 * @param {string} item.key
 * @param {number} item.quantity
 * @param {array} data
 */
function deleteProduct(product, data) {
	const button = document.querySelector(
		`.cart__item[data-id="${product.item.id}"].cart__item[data-color="${product.item.color}"] .cart__item__content__settings__delete`
	)
	button.addEventListener("click", (event) => {
        let cartStorage = JSON.parse(localStorage.getItem("cart"))
		const article = event.target.closest(".cart__item")
		const itemKey =
			article.getAttribute("data-id") + article.getAttribute("data-color")
		const itemIndex = cartStorage.findIndex(
			(element) => element.key === itemKey
		)

		article.remove()
		cartStorage.splice(itemIndex, 1)
		localStorage.setItem("cart", JSON.stringify(cartStorage))

		cart = getItems(data)
		createTotal()
	})
}

/**
 * Make an eventListener for each input, which update the localStorage
 * the cart and totals with each change
 * @param {array} data
 */
function updateQuantity(data) {
	const inputs = document.querySelectorAll(".itemQuantity")
	inputs.forEach((input) => {
		input.addEventListener("input", (event) => {
			const article = event.target.closest(".cart__item")
			const inputKey =
				article.getAttribute("data-id") + article.getAttribute("data-color")
			const cartStorage = JSON.parse(localStorage.getItem("cart"))
			const storageUpdate = cartStorage.find(
				(element) => element.key === inputKey
			)
			storageUpdate.quantity = Number(input.value)
			localStorage.setItem("cart", JSON.stringify(cartStorage))
			cart = getItems(data)
			createTotal(data)
		})
	})
}

/**
 * Create an event on the submit button, which check if the cart isn't empty, then
 * if the form is filled correctly. If both are validated, execute makeRequestBody
 * then make a POST request with the order to get the orderId. Then redirect to the
 * confirmation page with the orderId in the URL
 */
function submitOrder() {
	const orderButton = document.querySelector("#order")
	orderButton.addEventListener("click", (event) => {
		event.preventDefault()
		
		//Prevent the sending of the form if the cart is empty
		if (checkCart()) return

		const form = document.querySelector(".cart__order__form")
		//Prevent the sending of the form if not valid
		if (!checkForm(form)) return
		
		const body = makeRequestBody(form)

		fetch(`http://localhost:3000/api/products/order/`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				location.href = `./confirmation.html?orderId=${data.orderId}`
			})
			.catch((reject) => console.log(reject))
	})
}

/**
 * if the user is on the cart page, get the data in the API to execute all the
 * relevant function
 */
function initCart() {
	fetch(`http://localhost:3000/api/products/`)
		.then((response) => response.json())
		.then((data) => {
            cart = getItems(data)
			cart.forEach((product) => {
				createProducts(product)
				deleteProduct(product, data)
			})
            createTotal()
			updateQuantity(data)
            submitOrder()
		})
		.catch((reject) => console.log(reject))
    }

/**
 * If the user is on the confirmation page, display the order id by
 * getting it in the url
 */
function initConfirmation() {
	const url = new URL(window.location.href)
	const id = url.searchParams.get("orderId")
	const orderId = document.querySelector("#orderId")
	orderId.innerText = id
	localStorage.removeItem("cart")
}

if (/cart/.test(location.href)) initCart()

if (/confirmation/.test(location.href)) initConfirmation()
