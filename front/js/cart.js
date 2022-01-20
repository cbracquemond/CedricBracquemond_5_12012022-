let cart = getItems()

/**
 * Create a cart array with the localStorage data
 * @returns {array} cart
 */
 function getItems () {
    const cart = []
    let cartStorage = JSON.parse(localStorage.getItem("cart"))

    //prevent error if cart is empty
    if (cartStorage.length === 0) return cart

    cartStorage.forEach(item => {
        cart.push(item)
    })

    return cart
}

/**
 * search in the data the object corresponding to the item in the cart
 * @param {array} item 
 * @param {array} data 
 * @returns {object} kanap
 */
 function findKanap(item, data) {
    const kanap = data.find(element => element._id === item.id)
    return kanap
}

/**
 *  create the Article HTMLElement 
 * @param {array} item 
 * @returns {HTMLElement} article
 */
function createArticle (item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

/**
 * Create the div containing the product image, then the image, and put the image in the div
 * @param {object} kanap 
 * @returns {HTMLElement} slot
 */
function createImage (kanap) {
    const slot = document.createElement("div")
    slot.classList.add("cart__item__img")
    const image = document.createElement("img")
    image.src = kanap.imageUrl
    image.alt = kanap.altTxt
    slot.appendChild(image)
    return slot
    
}

/**
 * Create a div HTMLElement
 * @returns {HTMLElement} content
 */
function createItemContent () {
    const content = document.createElement("div")
    content.classList.add("cart__item__content")
    return content
}

/**
 * Create the itemDescription div, then the name,
 * price and color of the item, and append them to the description
 * @param {array} item 
 * @param {object} kanap 
 * @returns {HTMLElement} description
 */
function createItemDescription (item, kanap) {
    const h2 = document.createElement("h2")
    const color = document.createElement("p")
    const price = document.createElement("p")
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")
    h2.innerText = `${kanap.name}`
    color.innerText = `${item.color}`
    price.innerText = `${kanap.price} €`
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
 * @param {array} item 
 * @returns {HTMLInputElement} input
 */
function createInput(item) {
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = 1
    input.max = 100
    input.value = item.quantity
    return input
}

/**
 * Create the quantity div, and append it the Qte HTMLParagraphElement and
 * the input HTMLInputElement
 * @param {array} item 
 * @returns {HTMLElement} quantity
 */
 function createQuantity (item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    quantity.appendChild(createQte())
    const input = (createInput(item))
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
    deleteDiv.classList.add("cart__item__content__settings__delete")
    const deleteItem = document.createElement("p")
    deleteItem.innerText = "Supprimer"
    deleteDiv.appendChild(deleteItem)
    return deleteDiv 
}

/**
 * Loop through the cart to create the totalQuantity and totalPrice and put them in their
 * HTMLElement as innerText 
 * @param {array} data 
 */
 function createTotal(data) {
    let totalQuantity = 0
    let totalPrice = 0
    cart.forEach(item => {
        totalQuantity += item.quantity
        const kanap = findKanap(item, data)
        totalPrice += item.quantity * kanap.price
    });
    document.querySelector("#totalQuantity").innerText = totalQuantity
    document.querySelector("#totalPrice").innerText = totalPrice
}

/**
 * Create the setting HTMLElement, and append to it the quantity and deleteDiv HTMLElement
 * @param {array} item 
 * @returns {HTMLElement} setting
 */
 function createItemSetting(item) {
    const setting = document.createElement("div")
    setting.classList.add("cart__item__content__settings")
    setting.appendChild(createQuantity (item))
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
    const regexList = new Map()
    regexList.set("firstName", /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/)
    regexList.set("lastName", /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/)
    regexList.set("address", /^.*$/)
    regexList.set("city", /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/)
    regexList.set("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    inputs = form.querySelectorAll(".cart__order__form__question input")
    isChecked = []
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];   
        const errorMsg = document.querySelector(`#${input.id}ErrorMsg`)
        const label = input.closest(".cart__order__form__question").querySelector("label").innerText
        const newLabel = label.replace(":", "")
        const regex = regexList.get(`${input.id}`)
        if (!regex.test(input.value)) {
            errorMsg.innerText = `Votre ${newLabel} est invalide!`
            isChecked.push(false)
        }
        if (regex.test(input.value)) errorMsg.innerText = ""
    }
    if (isChecked.length != 0)  return false
    return true
}

/**
 * Loop through the cart to create an array of each product ID
 * @returns {array} products
 */
function createProductsArray() {
    products = []
    cart.forEach(item => {
        products.push(item.id)
    });
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
            firstName: `${form.elements.firstName.value}` ,
            lastName: `${form.elements.lastName.value}` ,
            address: `${form.elements.address.value}` ,
            city: `${form.elements.city.value}` ,
            email: `${form.elements.email.value}` ,
        },
        products: createProductsArray()
    }
    return body
}

/**
 * Target the cart__item section, and call all the relevant function
 * to create and append all the necessary elements to it 
 * @param {array} item 
 * @param {object} kanap 
 */
 function createProducts (item, data) {
    const kanap = findKanap(item, data)
    const section = document.querySelector("#cart__items")
    const article = createArticle (item)
    section.appendChild(article)
    article.appendChild(createImage (kanap))
    const content = createItemContent()
    article.appendChild(content)
    content.appendChild(createItemDescription(item, kanap))
    content.appendChild(createItemSetting(item))
}

/**
 * Make an eventListener for each "supprimer" div, which delete the item 
 * from the cart page, the cart, the localStorage
 * @param {array} item
 * @param {array} data
 */
 function deleteProduct(item, data) {
    const button = document.querySelector(`.cart__item[data-id="${item.id}"].cart__item[data-color="${item.color}"] .cart__item__content__settings__delete`)
    button.addEventListener("click", event => {
        const article = event.target.closest(".cart__item")
        const itemKey = article.getAttribute("data-id") + article.getAttribute("data-color")
        article.remove()
        let cartStorage = JSON.parse(localStorage.getItem("cart"))
        const itemIndex = cartStorage.findIndex(element => element.key === itemKey)
        cartStorage.splice(itemIndex, 1)
        localStorage.setItem("cart", JSON.stringify(cartStorage))
        cart = getItems()
        createTotal(data)
    })
}

/**
 * Make an eventListener for each input, which update the localStorage
 * the cart and totals with each change
 * @param {array} data 
 */
 function updateQuantity(data) {
    const inputs = document.querySelectorAll(".itemQuantity")
    inputs.forEach(input => {
        input.addEventListener("input", event => {
            const article = event.target.closest(".cart__item")
            const itemKey = article.getAttribute("data-id") + article.getAttribute("data-color")
            const cartStorage = JSON.parse(localStorage.getItem("cart"))
            const storageUpdate = cartStorage.find(element => element.key === itemKey)
            storageUpdate.quantity = Number(input.value)
            localStorage.setItem("cart", JSON.stringify(cartStorage))
            cart = getItems()
            createTotal(data)
        });
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
    orderButton.addEventListener("click", event => {
        event.preventDefault()
        if (checkCart()) return
        const form = document.querySelector(".cart__order__form")
        //Prevent the sending of the form if not valid
        if (!checkForm(form)) return
        const body = makeRequestBody(form)
        fetch(`http://localhost:3000/api/products/order/`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }) 
        .then((response) => response.json())
        .then((data => {
            location.href = `./confirmation.html?orderId=${data.orderId}`

        }))
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
    .then((data => {
        cart.forEach(item => {
            createProducts(item, data)
            deleteProduct(item, data)
        });
        createTotal(data)
        updateQuantity(data)
        submitOrder()
    }))
    .catch((reject) => console.log(reject))
}

/**
 * If the user is on the confirmation page, display the order id by
 * getting it in the url
 */
function initConfirmation() {
    const url = new URL( window.location.href)
    const id = url.searchParams.get("orderId")
    const orderId = document.querySelector("#orderId")
    orderId.innerText = id
    localStorage.removeItem("cart")
}

if (/cart/.test(location.href)) initCart()

if (/confirmation/.test(location.href)) initConfirmation()