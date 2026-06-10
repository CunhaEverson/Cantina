
const loadProducts = (produtos, idDivParent) => {
    const parentDiv = document.querySelector(idDivParent)

    parentDiv.innerHTML = ''

    produtos.forEach(produto => {

        const esgotado = produto.estoque === 0

        const html = `
            <article class="prato ${esgotado ? 'esgotado' : ''}">
                ${esgotado ? '<span class="tag">ESGOTADO</span>' : ''}
                <img src="${produto.image}" alt="${produto.title}">
                <h4>${produto.title}</h4>
                <h4>R$: ${produto.value.toFixed(2)}</h4>
                <p>${produto.description}</p>
                <button 
                    type="button" 
                    onclick="modalFunc(${produto.id})"
                    ${esgotado ? 'disabled' : ''}
                >
                    ${esgotado ? 'Indisponível' : 'Quero este prato'}
                </button>
            </article>
        `

        parentDiv.insertAdjacentHTML('beforeend', html)
    })
}
const modalFunc = (productId) => {
    const modal = document.querySelector('.modal')

    if (productId != null) {
        const produto = produtos.filter(produto => produto.id == productId)[0]
        if (produto != null) {
            modal.querySelector('#title').value = produto.title
        }
    }
    modal.classList.contains('hide') == true ? modal.classList.remove('hide') : modal.classList.add('hide')

}
const whatsappLinkGenerator = (phoneNumber, productTitle, productQuantity, buyerName, buyerAddress, buyerPayment) => `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Olá, eu quero: ${productQuantity} ${productTitle} - Entregar para ${buyerName} - no endereço/local(setor): ${buyerAddress} - A forma de pagamento será: ${buyerPayment}`

const checkout = phoneNumber => {
    const form = document.querySelector('#form-product')

    form.addEventListener('submit', e => {
        e.preventDefault()

        const productTitle = form.querySelector('#title').value
        const productQuantity = parseInt(form.querySelector('#quantity').value)
        const buyerName = form.querySelector('#name').value
        const buyerAddress = form.querySelector('#address').value
        const buyerPayment = form.querySelector('#payment').value

        const produto = produtos.find(p => p.title === productTitle)

        if (produto.estoque < productQuantity) {
            alert('Quantidade indisponível em estoque!')
            return
        }

        // 🔥 Diminui estoque
        produto.estoque -= productQuantity

        // Atualiza visual
        loadProducts(produtos, '#product-div')

        const whatsappUrl = whatsappLinkGenerator(
            phoneNumber,
            productTitle,
            productQuantity,
            buyerName,
            buyerAddress,
            buyerPayment
        )

        window.open(whatsappUrl)

        form.reset()
        document.querySelector('.modal').classList.add('hide')
    })
}
/* função java para busca de pratos*/
const search = (products, searchTerm) => {
    return products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
}

const loadSearch = (form, productsDivId) => {

    const productsDiv = document.querySelector(productsDivId)
    const inputSearch = form.querySelector('#inputSearch')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        if (inputSearch.value.trim() !== '') {

            productsDiv.innerHTML = ''

            const results = search(produtos, inputSearch.value)

            if (results.length === 0) {
                productsDiv.innerHTML = '<p>Nenhum prato encontrado.</p>'
                return
            }

            loadProducts(results, productsDivId)
        }
    })
}

loadProducts(produtos, '#product-div')
checkout('558195327216')
loadSearch(document.querySelector('#formSearch'), '#product-div')