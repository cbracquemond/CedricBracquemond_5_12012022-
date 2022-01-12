fetch("http://localhost:3000/api/products")
.then((response) => response.json())
.then((data) => createProducts(data))

/**
 * Create all the products cards with functioning anchors
 * @param {object} kanaps 
 */
function createProducts(kanaps) {
    kanaps.forEach((kanap) => {
        
        const {_id, name, imageUrl, altTxt, description } = kanap
        const anchor = makeAnchor(_id)
        const article = makeArticle(anchor)
        article.appendChild(makeTitle(name))
        article.appendChild(makeImage(imageUrl, altTxt))
        article.appendChild(makeParagraph(description))
       
    });
}

/**
 * Create a HTMLAnchorElement and append it to the items HTMLElement
 * @param {string} id Id of the product
 * @returns HTMLAnchorElement
 */
function makeAnchor(id) {
    const items = document.getElementById("items")
    const a = document.createElement("a")
    a.href = `./product.html?id=${id}`
    items.appendChild(a)
    return a
}

/**
 * Create an article HTMLElement and append it to the anchor HTMLAnchorElement
 * @param {HTMLAnchorElement} anchor 
 * @returns HTMLElement
 */
function makeArticle(anchor) {
    const article = document.createElement("article")
    anchor.appendChild(article)
    return article
}

/**
 * Create a h3 HTMLHeaderElement, add its text, add the productName class,
 * then append it to the elements array
 * @param {string} name 
 * @returns HTMLHeaderElement
 */
function makeTitle(name) {
    const h3 = document.createElement("h3")
    h3.innerText = name
    h3.classList.add("productName")
    return h3
}

/**
 * Create an image HTMLImageElement, add its src and alt, 
 * then append it to the elements array
 * @param {string} url 
 * @param {string} alt 
 * @returns HTMLImageElement
 */
function makeImage(url, alt) {
    const img = document.createElement("img")
    img.src = url
    img.alt = alt
    return img
}

/**
 * Create a p HTMLParagraphElement, add its text, add the
 * productDescription class, then append it to the elements array
 * @param {string} description 
 * @returns HTMLParagraphElement
 */
function makeParagraph(description) {
    const p = document.createElement("p")
    p.innerText = description
    p.classList.add("productDescription")
    return p
}




