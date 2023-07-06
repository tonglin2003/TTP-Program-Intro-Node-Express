const express = require('express');
const app = express();
const port = 3000;

const sampleProducts = [
    {
    id: 1,
    productName: "Sample Product 1",
    productImg: {
      url: "https://example.com/product1.jpg",
      alt: "Sample Product 1 Image",
    },
    price: 9.99,
    rate: 4.5,
    popularity: 123,
  },
  {
    id: 2,
    productName: "Sample Product 2",
    productImg: {
      url: "https://example.com/product2.jpg",
      alt: "Sample Product 2 Image",
    },
    price: 19.99,
    rate: 3.8,
    popularity: 87,
  },
  {
    id: 3,
    productName: "Sample Product 3",
    productImg: {
      url: "https://example.com/product3.jpg",
      alt: "Sample Product 3 Image",
    },
    price: 14.99,
    rate: 4.2,
    popularity: 56,
  },
  {
    id: 4,
    productName: "Sample Product 4",
    productImg: {
      url: "https://example.com/product4.jpg",
      alt: "Sample Product 4 Image",
    },
    price: 24.99,
    rate: 4.8,
    popularity: 231,
  },
  {
    id: 5,
    productName: "Sample Product 5",
    productImg: {
      url: "https://example.com/product5.jpg",
      alt: "Sample Product 5 Image",
    },
    price: 12.99,
    rate: 4.0,
    popularity: 99,
  },
];

function generateId(collection)
{
    if (collection.length === 0) return 1;
    const lastItem = collection[collection.length - 1];
    return lastItem.id + 1;
}

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    next();
  });
app.use(express.json());

// middleware error handling
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message || 'Internal Server Error'
      }
    });
  });

app.get('/', (req, res) => {
    res.send("testing...");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/products', (req, res) => {
    res.send(sampleProducts);
});

app.get('/products/:productId', (req, res)=>{
    const productId = parseInt(req.params.productId, 10);
    const product = sampleProducts.find((product)=> product.id === productId);
    if (product)
    {
        res.send(product);
    }
    else
    {
        res.status(404).send({message: "product not found!"});
    }
});

app.post('/products', (req, res) => {
    const newProduct = {
        ...req.body,
        id: generateId(sampleProducts)
    };
    console.log("newProduct", newProduct);
    sampleProducts.push(newProduct);
    res.send(newProduct);
});

app.patch("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productUpdates = req.body;
    const productIndex = sampleProducts.findIndex(product => product.id === productId);
    
    if (productIndex !== -1)
    {
    const updatedProduct = { ...sampleProducts[productIndex], ...productUpdates };
    sampleProducts[productIndex] = updatedProduct;
    res.send(updatedProduct);
    }
    else
    {
        res.status(404).send({message: "product not found"})
    }
  });

app.delete("/products/:id", (req, res)=> {
    const productId = parseInt(req.params.id, 10);
    const productIndex = sampleProducts.findIndex(product => product.id === productId);

    if (productIndex !== -1)
    {
        sampleProducts.splice(productIndex, 1);
        res.send({message: 'product deleted successfully'});
    }
    else
    {
        res.status(404).send({message: "product not found"})
    }
});