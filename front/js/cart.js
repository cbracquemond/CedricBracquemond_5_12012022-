cart = getItems()
console.log(cart)


function getItems () {
    const numberOfItem = localStorage.length
    const cart = []
    for (let i = 0; i < numberOfItem; i++) {
        const itemJson = localStorage.getItem(localStorage.key(i))
        const item = JSON.parse(itemJson)
        cart.push(item)
    }
    return cart
}
