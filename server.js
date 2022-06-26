// import express from "express";
import { readFile } from "fs";
// import * as fsp from "fs/promises";
import express from "express";
import * as fsp from "fs/promises";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hi");
});

// app.get("/products", (req, res) => {
//   fsp
//     .readFile("./products.json", "utf8")
//     .then((data) => res.send(JSON.parse(data)));
// });

app.get("/products/:productId", (req, res) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.send(product);
    })
    .catch((e) => res.send("you got an ERROR"));
});

function getMaxId(arr) {
  const ids = arr.map((object) => {
    return object.id;
  });
  const max = Math.max(...ids);
  return max;
}

app.post("/products", (req, res) => {
  const { title } = req.body;
  console.log(title);
  Product.insertMany([
    {
      title,
    },
  ]).then((products) => {
    res.send(products);
  });
});

app.patch("/products/:productId", (req, res) => {
  const { productId } = req.params;
  Product.findByIdAndUpdate(productId, req.body)
    .then((products) => res.send(products))
    .catch((e) => res.send("you got an ERROR"));
});

app.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;

  Product.findByIdAndRemove(productId)
    .then((product) => res.send(product))
    .catch((e) => res.send("you got an ERROR"));
});

app.get("/products", (req, res) => {
  console.log("req.query", req.query);
  const { title } = req.query;

  if (req.query) {
    const { title } = req.query;
    Product.find().then((products) => {
      const afterFilterProducts = title
        ? products.filter((product) =>
            product.title.toLowerCase().includes(title.toLowerCase())
          )
        : products;

      res.send(afterFilterProducts);
    });
  }
});

const Product = mongoose.model("Product", { title: String });
mongoose.connect("mongodb://localhost:27017/gocode-shop-5-22").then(() => {
  app.listen(8000);
});
