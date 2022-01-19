const url = new URL( window.location.href)
const id = url.searchParams.get("id")

/**
 * Create the product image and append it to the item__img HTMLElement
 * @param {string} imageUrl 
 * @param {string} altTxt 
 */
function createImage (imageUrl, altTxt) {
    slot = document.querySelector(".item__img")
    const img = document.createElement("img")
    img.src = imageUrl
    img.alt = altTxt
    slot.appendChild(img)
}

/**
 * Set the product name in the title HTMLHeaderElement
 * @param {string} name 
 */
function setTitle (name) {
    h1 = document.querySelector("#title")
    h1.innerText = name
}

/**
 * Set the price in the price HTMLParagraphElement
 * @param {string} price 
 */
function setPrice (price) {
    p = document.querySelector("#price")
    p.innerText = price
}

/**
 * Set the descritpion in the description HTMLParagraphElement
 * @param {string} description 
 */
function setDescription (description) {
    p = document.querySelector("#description")
    p.innerText = description
}

/**
 * Create all the colors for the product and put them in the colors menu
 * @param {string} colors 
 */
function createColors (colors) {
    menu = document.querySelector("#colors")
    colors.forEach(color => {
        const option = document.createElement("option")
        option.value = color
        option.innerText = color
        menu.appendChild(option)
    });
}

/**
 * Check if the chosen product is already in the cart with the choosen color,
 * then update the quantity if so, or create it if not
 * @param {string} key 
 * @param {object} product 
 */
 function cartUpdate(key, product) {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(product))
        } else {
        let storageUpdate = localStorage.getItem(key)
        storageUpdate = JSON.parse(storageUpdate)
        storageUpdate.quantity += product.quantity
        localStorage.setItem(key, JSON.stringify(storageUpdate))
    }
}

/**
 * Display the correct product information 
 * @param {object} kanap 
 */
 function constructPage(kanap) {
    const {imageUrl, altTxt, name, price, description, colors} = kanap
    createImage(imageUrl, altTxt)
    setTitle(name)
    setPrice(price)
    setDescription (description)
    createColors (colors)
}

/**
 * Add a click event on the button to pass the product objet in the local storage
 * @param {object} kanap 
 */
function buttonClick (kanap) {
    const button = document.querySelector("#addToCart")
    button.addEventListener("click", e => { 
        const product = {
            id: kanap._id,
            color: document.querySelector("#colors").value,
            quantity: Number(document.querySelector("#quantity").value),
        }
        const key = id + product.color
        if (product.quantity != 0 && product.color != "") {
            cartUpdate(key, product)
        } else {
            alert("Veuillez définir une couleur et une quantité")
        }
    }, false )
}

/**
 * Begin the execution of the page script, by making a request to the API to get the 
 * clicked product data, then executing constructPage and buttonClick
 */
function init() {   
    fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data => {
        constructPage(data)
        buttonClick(data)
    }))
    .catch((reject) => console.log(reject))
}

init()