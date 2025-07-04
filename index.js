const fs = require('fs');
const http = require('http');
const url = require('url');

// Load templates
const home = fs.readFileSync('./template/index.html', 'utf-8');
const about = fs.readFileSync('./template/about.html', 'utf-8');
const contact = fs.readFileSync('./template/contact.html', 'utf-8');
const errorPage = fs.readFileSync('./template/error.html', 'utf-8');
const layout = fs.readFileSync('./template/products.html', 'utf-8');
const cardTemplate = fs.readFileSync('./template/product-card.html', 'utf-8');
const ProductDetailHTML = fs.readFileSync('./template/product_detail.html', 'utf-8');

// Load product data
const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

// Create cards
const productCards = products.map(p => {
    const shortDesc = p.description.length > 100 ? p.description.slice(0, 100) + '...' : p.description;
    return cardTemplate
        .replace('{{%image%}}', p.image)
        .replace('{{%prices%}}', p.title)
        .replace('{{%price%}}', p.price)
        .replace('{{%description%}}', shortDesc)
        .replace('{{%category%}}', p.category)
        .replace('{{%id%}}', p.id);
}).join('');

const finalProductPage = layout.replace('{{%PRODUCT_CARDS%}}', productCards);

// ✅ Proper function to fill in a product's detail page
function replaceProductDetail(template, product) {
    return template
        .replace('{{%image%}}', product.image)
        .replace('{{%title%}}', product.title)
        .replace('{{%price%}}', product.price)
        .replace('{{%description%}}', product.description)
        .replace('{{%category%}}', product.category)
        .replace('{{%id%}}', product.id);
}

const server = http.createServer((req, res) => {
    const { query, pathname: path } = url.parse(req.url, true);

    if (path === '/' || path === '/home') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(home);

    } else if (path === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(about);

    } else if (path === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(contact);

    } else if (path === '/product') {
        if (!query.id) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(finalProductPage);
        } else {
            const product = products.find(p => p.id == query.id);
            if (product) {
                const productDetailHTML = replaceProductDetail(ProductDetailHTML, product);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(productDetailHTML);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h2>Product not found</h2>');
            }
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(errorPage);
    }
});

server.listen(2000, '127.0.0.1', () => {
    console.log('🚀 Server is running at http://127.0.0.1:2000');
});
