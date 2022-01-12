//Get the id from the url to pass in the fetch API
const url = new URL( window.location.href)
const id = url.searchParams.get("id")

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data => {
    constructPage(data)
    buttonClick(data)
    }))

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
 * Add a click event on the button to pass the product objet in the local storage
 * @param {object} kanap 
 */
function buttonClick (kanap) {
    const button = document.querySelector("#addToCart")
    button.addEventListener("click", e => {
        const color = document.querySelector("#colors").value
        const quantity = document.querySelector("#quantity").value
        const product = {
            name: kanap.name,
            price: kanap.price,
            id: kanap._id,
            color: color,
            quantity: Number(quantity),
            imageUrl: kanap.imageUrl,
            altTxt: kanap.altTxt
        }
        localStorage.setItem(id, JSON.stringify(product))
    })
}
