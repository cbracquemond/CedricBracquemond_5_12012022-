let cart = getItems()
fetch(`http://localhost:3000/api/products/`)
.then((response) => response.json())
.then((data => {
    cart.forEach(item => {
        createProducts(item, data)
        deleteProduct(item, data)
    });
    createTotal(cart, data)
    updateQuantity(data)
}))

/**
 * Create a cart array with the localStorage data
 * @returns {array} cart
 */
 function getItems () {
    const cart = []
    for (let i = 0; i < localStorage.length; i++) {
        const itemJson = localStorage.getItem(localStorage.key(i))
        const item = JSON.parse(itemJson)
        cart.push(item)
    }
    return cart
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
 * search in the data the object corresponding to the item in the cart
 * @param {array} item 
 * @param {array} data 
 * @returns object
 */
 function findKanap(item, data) {
    const kanap = data.find(element => element._id === item.id)
    return kanap
}

/**
 *  create the Article HTMLElement 
 * @param {array} item 
 * @returns HTMLElement
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
 * @returns HTMLElement
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
 * @returns HTMLElement
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
 * @returns HTMLElement
 */
function createItemDescription (item, kanap) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")
    const h2 = document.createElement("h2")
    h2.innerText = `${kanap.name}`
    const color = document.createElement("p")
    color.innerText = `${item.color}`
    const price = document.createElement("p")
    price.innerText = `${kanap.price} €`
    description.appendChild(h2)
    description.appendChild(color)
    description.appendChild(price)
    return description
}

/**
 * Create the setting HTMLElement, and append to it the quantity and deleteDiv HTMLElement
 * @param {array} item 
 * @returns HTMLElement
 */
 function createItemSetting(item) {
    const setting = document.createElement("div")
    setting.classList.add("cart__item__content__settings")
    setting.appendChild(createQuantity (item))
    setting.appendChild(createDeleteDiv())
    return setting
}

/**
 * Create the quantity div, and append it the Qte HTMLParagraphElement and
 * the input HTMLInputElement
 * @param {array} item 
 * @returns HTMLElement
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
 * Create a HTMLParagraphElement displaying the text "Qté :"
 * @returns HTMLParagraphElement
 */
 function createQte() {
    const qte = document.createElement("p")
    qte.innerText = "Qté : "
    return qte
}

/**
 * Create the input HTMLInputElement and set its attributes
 * @param {array} item 
 * @returns HTMLInputElement
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
 * Create the deleteDiv HTMLElement and the deleteItem HTMLParagraphElement
 * and append the latter to the former
 * @returns HTMLElement
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
 * Make an eventListener for each "supprimer" div, which delete the item 
 * from the cart page, the cart, the localStorage
 * @param {HTMLElement}
 */
 function deleteProduct(item, data) {
    const button = document.querySelector(`.cart__item[data-id="${item.id}"].cart__item[data-color="${item.color}"] .cart__item__content__settings__delete`)
    button.addEventListener("click", event => {
        const article = event.target.closest(".cart__item")
        const itemKey = article.getAttribute("data-id") + article.getAttribute("data-color")
        article.remove()
        localStorage.removeItem(itemKey)
        cart = getItems()
        createTotal(cart, data)
    })
}

/**
 * Takes the totalQuantity and priceTotal and put them in their
 * HTMLElement as innerText
 * @param {array} cart 
 * @param {array} data 
 */
 function createTotal(cart, data) {
    document.querySelector("#totalQuantity").innerText = totalQuantity(cart)
    document.querySelector("#totalPrice").innerText = totalPrice(cart, data)
}

/**
 * Add all the quantity of all the items in the cart
 * @param {array} cart 
 * @returns Number
 */
 function totalQuantity(cart) {
    let totalQty = 0
    cart.forEach((item) => {
        totalQty += item.quantity 
    })
    return totalQty
}

/**
 * Make the price total of all the items in the cart
 * @param {array} cart 
 * @param {array} data 
 * @returns Number
 */
 function totalPrice(cart, data) {
    let priceTotal = 0
    cart.forEach(item => {
        const kanap = findKanap(item, data)
        priceTotal += item.quantity * kanap.price
    });
    return priceTotal
}

/**
 * Make an eventListener for each input, which update the localStorage
 * and the total price and quantity with each change
 * @param {array} item 
 * @param {array} data 
 */
 function updateQuantity(data) {
    const inputs = document.querySelectorAll(".itemQuantity")
    inputs.forEach(input => {
        input.addEventListener("input", event => {
            const article = event.target.closest(".cart__item")
            const itemKey = article.getAttribute("data-id") + article.getAttribute("data-color")
            let storageUpdate = localStorage.getItem(itemKey)
            storageUpdate = JSON.parse(storageUpdate)
            storageUpdate.quantity = Number(input.value)
            localStorage.setItem(itemKey, JSON.stringify(storageUpdate))
            const item = cart.find(element => element.id === article.getAttribute("data-id") )
            item.quantity = Number(input.value)
            createTotal(cart, data)
        });
    })
}























