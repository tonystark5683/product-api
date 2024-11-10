const express = require("express");
const router = express.Router();

let products = [
  {
    id: 1,
    name: "Product 1",
    description: "Description for product 1",
    price: 10.99,
    quantity: 20,
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description for product 2",
    price: 11.99,
    quantity: 23,
  },
  {
    id: 3,
    name: "Product 3",
    description: "Description for product 3",
    price: 10.99,
    quantity: 20,
  },
  {
    id: 4,
    name: "Product 4",
    description: "Description for product 4",
    price: 40.99,
    quantity: 10,
  },
  {
    id: 5,
    name: "Product 5",
    description: "Description for product 5",
    price: 50.99,
    quantity: 30,
  },
];

router.get("/products", (req, res) => {
  try {
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/products", (req, res) => {
  try {
    const { name, description = "", price, quantity = 0 } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({
          message:
            "Invalid input: name is required and must be a non-empty string",
        });
    }

    if (typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({
          message:
            "Invalid input: price is required and must be a positive number",
        });
    }

    const newProduct = {
      id: products.length + 1,
      name: name.trim(),
      description: description.trim(),
      price,
      quantity,
    };

    products.push(newProduct);
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, quantity } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim() === "")
    ) {
      return res
        .status(400)
        .json({ message: "Invalid input: name must be a non-empty string" });
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      return res
        .status(400)
        .json({ message: "Invalid input: price must be a positive number" });
    }

    if (
      quantity !== undefined &&
      (typeof quantity !== "number" || quantity < 0)
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid input: quantity must be a non-negative number",
        });
    }

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    products.splice(productIndex, 1);
    res.status(204).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/product", (req, res) => {
  try {
    const { sortBy, order } = req.query;

    let sortedProducts = [...products];

    if (sortBy) {
      if (sortBy === "price") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === "name") {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        return res.status(400).json({ message: "Invalid sortBy value" });
      }

      if (order === "desc") {
        sortedProducts.reverse();
      } else if (order && order !== "asc") {
        return res.status(400).json({ message: "Invalid order value" });
      }
    }

    res.status(200).json(sortedProducts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
