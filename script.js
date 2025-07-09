// Configuração da API (opcional - para uso futuro)
const API_BASE_URL = 'http://localhost:5000/api';

// Gerar ID de sessão único (usando apenas variáveis em memória)
let sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Array de produtos (mesmo do código original)
const products = [
    // ELETRÔNICOS
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
        name: "Fone de Ouvido XYZ",
        price: 199.90,
        category: "eletronicos",
        description: "Fone de ouvido com qualidade de som excepcional, design ergonômico e cancelamento de ruído ativo."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
        name: "Smartwatch Moderno",
        price: 499.90,
        category: "eletronicos",
        description: "Smartwatch com monitoramento de saúde, GPS integrado e resistência à água."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop",
        name: "Câmera Digital Pro",
        price: 899.00,
        category: "eletronicos",
        description: "Câmera digital profissional com lente intercambiável e gravação em 4K."
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300&h=200&fit=crop",
        name: "Laptop Gamer",
        price: 2499.00,
        category: "eletronicos",
        description: "Laptop para jogos com placa de vídeo dedicada, processador de alta performance e tela Full HD."
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
        name: "Smartphone Premium",
        price: 1299.90,
        category: "eletronicos",
        description: "Smartphone com câmera tripla, tela OLED e processador de última geração."
    },
    // MODA
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
        name: "Camiseta Básica",
        price: 49.90,
        category: "moda",
        description: "Camiseta 100% algodão, confortável e versátil para o dia a dia."
    },
    {
        id: 9,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop&crop=center",
        name: "Tênis Esportivo",
        price: 199.90,
        category: "moda",
        description: "Tênis esportivo com tecnologia de amortecimento e design moderno."
    },
    // CASA E DECORAÇÃO
    {
        id: 13,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
        name: "Vaso Decorativo",
        price: 79.90,
        category: "casa",
        description: "Vaso decorativo em cerâmica com design contemporâneo, perfeito para plantas."
    },
    // LIVROS
    {
        id: 18,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
        name: "Livro de Programação",
        price: 59.90,
        category: "livros",
        description: "Guia completo de programação para iniciantes e desenvolvedores intermediários."
    }
];

// FUNÇÕES DE GERENCIAMENTO DE CARRINHO CORRIGIDAS

// Variável global para armazenar o carrinho em memória
let cart = [];

// Função para salvar carrinho (usando localStorage apenas se disponível)
function saveCart() {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('shoptech_cart', JSON.stringify(cart));
        }
    } catch (error) {
        console.log('LocalStorage não disponível, usando apenas memória');
    }
}

// Função para carregar carrinho
function loadCart() {
    try {
        if (typeof localStorage !== 'undefined') {
            const savedCart = localStorage.getItem('shoptech_cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
        }
    } catch (error) {
        console.log('LocalStorage não disponível, iniciando carrinho vazio');
        cart = [];
    }
    updateCartCount();
}

// Função CORRIGIDA para adicionar produto ao carrinho
function addToCart(productId, quantity = 1) {
    // Validar entrada
    if (!productId || isNaN(productId)) {
        console.error('ID do produto inválido:', productId);
        showNotification('Erro: Produto inválido!', 'error');
        return false;
    }
    
    // Converter para número inteiro
    productId = parseInt(productId);
    quantity = parseInt(quantity) || 1;
    
    // Validar quantidade
    if (quantity < 1) {
        console.error('Quantidade inválida:', quantity);
        showNotification('Erro: Quantidade deve ser maior que zero!', 'error');
        return false;
    }
    
    // Buscar produto no array
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Produto não encontrado:', productId);
        showNotification('Erro: Produto não encontrado!', 'error');
        return false;
    }
    
    // Verificar se o produto já existe no carrinho
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Produto já existe, atualizar quantidade
        cart[existingItemIndex].quantity += quantity;
        console.log(`Quantidade atualizada para ${product.name}: ${cart[existingItemIndex].quantity}`);
    } else {
        // Produto novo, adicionar ao carrinho
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
        };
        cart.push(newItem);
        console.log(`Produto adicionado ao carrinho:`, newItem);
    }
    
    // Salvar carrinho e atualizar interface
    saveCart();
    updateCartCount();
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
    
    // Log para debug
    console.log('Carrinho atual:', cart);
    console.log('Total de itens:', cart.reduce((total, item) => total + item.quantity, 0));
    
    return true;
}

// Função para remover produto do carrinho
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex === -1) {
        console.error('Produto não encontrado no carrinho:', productId);
        return false;
    }
    
    const removedProduct = cart[productIndex];
    cart.splice(productIndex, 1);
    
    saveCart();
    updateCartCount();
    renderCart();
    
    showNotification(`${removedProduct.name} removido do carrinho!`, 'info');
    console.log(`Produto removido:`, removedProduct);
    
    return true;
}

// Função para atualizar quantidade no carrinho
function updateCartQuantity(productId, quantity) {
    quantity = parseInt(quantity);
    
    if (isNaN(quantity) || quantity < 0) {
        console.error('Quantidade inválida:', quantity);
        return false;
    }
    
    const item = cart.find(item => item.id === productId);
    if (!item) {
        console.error('Item não encontrado no carrinho:', productId);
        return false;
    }
    
    if (quantity === 0) {
        removeFromCart(productId);
    } else {
        item.quantity = quantity;
        saveCart();
        updateCartCount();
        renderCart();
        console.log(`Quantidade atualizada para ${item.name}: ${quantity}`);
    }
    
    return true;
}

// Função para limpar carrinho
function clearCart() {
    const itemCount = cart.length;
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    
    showNotification(`Carrinho limpo! ${itemCount} itens removidos.`, 'info');
    console.log('Carrinho limpo');
}

// Função para atualizar contador do carrinho
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = cartCount;
        }
    });
    
    console.log(`Contador do carrinho atualizado: ${cartCount}`);
}

// Função para calcular total do carrinho
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Função para renderizar carrinho
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) {
        console.log('Elementos do carrinho não encontrados');
        return;
    }
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                <div class="cart-item-quantity">
                    <label>Quantidade:</label>
                    <input type="number" value="${item.quantity}" min="1" max="99" 
                           onchange="updateCartQuantity(${item.id}, this.value)"
                           onkeypress="handleQuantityKeypress(event, ${item.id})">
                </div>
                <p class="cart-item-subtotal">
                    Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
            </div>
            <button class="btn btn-remove" onclick="removeFromCart(${item.id})">Remover</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const total = getCartTotal();
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Função para lidar com teclas pressionadas no input de quantidade
function handleQuantityKeypress(event, productId) {
    if (event.key === 'Enter') {
        updateCartQuantity(productId, event.target.value);
    }
}

// Função MELHORADA para mostrar notificações
function showNotification(message, type = 'success') {
    // Remover notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Definir cores baseadas no tipo
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    const color = colors[type] || colors.success;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Função para renderizar produtos
function renderProducts(productsToRender = products) {
    const productGrid = document.getElementById('all-products-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.setAttribute('data-id', product.id);
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            <button class="btn btn-add-to-cart" onclick="addToCart(${product.id})">
                Adicionar ao Carrinho
            </button>
            <a href="detalhes-produto.html?id=${product.id}" class="btn btn-secondary btn-details">
                Ver Detalhes
            </a>
        `;
        
        productGrid.appendChild(productElement);
    });
}

// Função para obter informações do produto
function getProductById(productId) {
    return products.find(p => p.id === parseInt(productId));
}

// Função para verificar se o produto está no carrinho
function isProductInCart(productId) {
    return cart.some(item => item.id === parseInt(productId));
}

// Função para obter quantidade do produto no carrinho
function getProductQuantityInCart(productId) {
    const item = cart.find(item => item.id === parseInt(productId));
    return item ? item.quantity : 0;
}

// INICIALIZAÇÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando carrinho...');
    
    // Carregar carrinho
    loadCart();
    
    // Página de produtos
    if (document.getElementById('all-products-grid')) {
        renderProducts();
        console.log('Produtos renderizados');
    }
    
    // Página de carrinho
    if (document.getElementById('cart-items')) {
        renderCart();
        console.log('Carrinho renderizado');
        
        // Event listeners para botões do carrinho
        const clearCartBtn = document.getElementById('clear-cart-button');
        const checkoutBtn = document.getElementById('checkout-button');
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                    clearCart();
                }
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Seu carrinho está vazio!', 'warning');
                    return;
                }
                
                const total = getCartTotal();
                showNotification(`Finalizando compra de R$ ${total.toFixed(2).replace('.', ',')}`, 'info');
                
                // Aqui você implementaria a integração com o sistema de pagamento
                console.log('Iniciando checkout:', cart);
            });
        }
    }
    
    // Event listeners globais para botões "Adicionar ao Carrinho"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            e.preventDefault();
            
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                const productId = parseInt(productItem.getAttribute('data-id'));
                if (productId) {
                    addToCart(productId);
                }
            }
        }
    });
    
    console.log('Inicialização concluída');
});

// Adicionar estilos CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
        gap: 15px;
    }
    
    .cart-item-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 5px;
    }
    
    .cart-item-details {
        flex: 1;
    }
    
    .cart-item-details h4 {
        margin: 0 0 5px 0;
        font-size: 16px;
    }
    
    .cart-item-price {
        font-weight: bold;
        color: #28a745;
        margin: 5px 0;
    }
    
    .cart-item-subtotal {
        font-size: 14px;
        color: #666;
        margin: 5px 0;
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
    }
    
    .cart-item-quantity input {
        width: 60px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 3px;
        text-align: center;
    }
    
    .btn-remove {
        background: #dc3545;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 3px;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .btn-remove:hover {
        background: #c82333;
    }
    
    .empty-cart-message {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 40px;
    }
    
    .notification {
        font-family: Arial, sans-serif;
        line-height: 1.4;
    }
    
    .notification-success {
        background: #28a745 !important;
    }
    
    .notification-error {
        background: #dc3545 !important;
    }
    
    .notification-info {
        background: #17a2b8 !important;
    }
    
    .notification-warning {
        background: #ffc107 !important;
        color: #212529 !important;
    }
`;
document.head.appendChild(style);