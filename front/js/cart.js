function getItems () {
    const cart = []
    for (let i = 0; i < localStorage.length; i++) {
        const itemJson = localStorage.getItem(localStorage.key(i))
        const item = JSON.parse(itemJson)
        cart.push(item)
    }
    return cart
}


function createArticle (item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function createImage (kanap) {
    const slot = document.createElement("div")
    slot.classList.add("cart__item__img")
    const image = document.createElement("img")
    image.src = kanap.imageUrl
    image.alt = kanap.altTxt
    slot.appendChild(image)
    return slot
    
}

function createItemContent () {
    const content = document.createElement("div")
    content.classList.add("cart__item__content")
    return content
}

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

function createQte() {
    const qte = document.createElement("p")
    qte.innerText = "Qté : "
    return qte
}

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

function updateCart(input, id) {
    input.addEventListener("input", e => {
        let storageUpdate = localStorage.getItem(id)
        storageUpdate = JSON.parse(storageUpdate)
        storageUpdate.quantity = Number(input.value)
        localStorage.setItem(id, JSON.stringify(storageUpdate))
        const cartUpdate = cart.find(item => item.id === id)
        cartUpdate.quantity = Number(input.value)
        createTotal(cart)
    })
}

function createQuantity (item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    quantity.appendChild(createQte())
    const input = (createInput(item))
    quantity.appendChild(input)
    updateCart(input, item.id)
    return quantity
}

function createDeleteDiv() {
    const deleteDiv = document.createElement("div")
    deleteDiv.classList.add("cart__item__content__settings__delete")
    const deleteItem = document.createElement("p")
    deleteItem.innerText = "Supprimer"
    deleteDiv.appendChild(deleteItem)
    return deleteDiv
    
}

function createItemSetting(item) {
    const setting = document.createElement("div")
    setting.classList.add("cart__item__content__settings")
    setting.appendChild(createQuantity (item))
    setting.appendChild(createDeleteDiv())
    return setting
}

function createProducts (item, kanap) {
    const section = document.querySelector("#cart__items")
    const article = createArticle (item)
    section.appendChild(article)
    article.appendChild(createImage (kanap))
    const content = createItemContent()
    article.appendChild(content)
    content.appendChild(createItemDescription(item, kanap))
    content.appendChild(createItemSetting(item))
}

function deleteProduct() {
    const buttons = document.querySelectorAll(".cart__item__content__settings__delete")
    buttons.forEach((button) => {
        button.addEventListener("click", event => {
            const article = event.target.parentNode.parentNode.parentNode.parentNode
            article.remove()
            localStorage.removeItem(article.getAttribute("data-id"))
        } , false )
        
    })
}

function totalQuantity(cart) {
    let totalQty = 0
    cart.forEach((item) => {
        totalQty += item.quantity 
    })
    return totalQty
}

function totalPrice(cart, data) {
    let priceTotal = 0
    cart.forEach(item => {
        const kanap = findKanap(item, data)
        priceTotal += item.quantity * kanap.price
    });
    return priceTotal
}

function createTotal(cart, data) {
    document.querySelector("#totalQuantity").innerText = totalQuantity(cart)
    document.querySelector("#totalPrice").innerText = totalPrice(cart, data)
}

function findKanap(item, data) {
    const kanap = data.find(element => element._id === item.id)
    return kanap
}

const cart = getItems()
fetch(`http://localhost:3000/api/products/`)
    .then((response) => response.json())
    .then((data => {
        cart.forEach(item => {
            const kanap = findKanap(item, data)
            createProducts(item, kanap)
        });
        createTotal(cart, data)
    }))
deleteProduct()
