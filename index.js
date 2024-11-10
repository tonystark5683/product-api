const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
const productRoutes = require("./routes/product-route");
app.use(productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
