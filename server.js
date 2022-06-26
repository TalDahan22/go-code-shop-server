// import express from "express";
import { readFile } from "fs";
// import * as fsp from "fs/promises";
import express from "express";
import * as fsp from "fs/promises";

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
  fsp.readFile("./products.json", "utf8").then((data) => {
    const products = JSON.parse(data);
    const product = products.find((product) => product.id === +productId);
    console.log(product);
    res.send(product);
  });
});

function getMaxId(arr) {
  const ids = arr.map((object) => {
    return object.id;
  });
  const max = Math.max(...ids);
  return max;
}
app.post("/products", (req, res) => {
  fsp.readFile("./products.json", "utf8").then((data) => {
    console.log(req.body);
    const { title } = req.body;
    console.log(title);
    if (title) {
      const products = JSON.parse(data);
      products.push({
        id: getMaxId(products) + 1,
        title: req.body.title,
        // price: req.body.price,
      });
      fsp.writeFile("./products.json", JSON.stringify(products));
      res.send(products);
    } else {
      res.send("show the title of the product");
    }
  });
});

app.patch("/products/:productId", (req, res) => {
  const { productId } = req.params;

  fsp.readFile("./products.json", "utf8").then((data) => {
    if (req.body) {
      const products = JSON.parse(data);
      const productsIndex = products.findIndex(
        (product) => product.id === +productId
      );
      products[productsIndex] = { ...products[productsIndex], ...req.body };
      fsp
        .writeFile("./products.json", JSON.stringify(products))
        .then(() => {
          res.send(products);
        })
        .catch((err) => "error", products);
    }
  });
});

app.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;

  fsp.readFile("./products.json", "utf8").then((data) => {
    if (productId) {
      const products = JSON.parse(data);
      const productIndex = products.findIndex(
        (product) => product.id === +productId
      );
      if (productIndex >= 0) {
        products.splice(productIndex, 1);
        fsp.writeFile("./products.json", JSON.stringify(products)).then(() => {
          res.send(products);
        });
      } else {
        res.send(products);
      }
    }
  });
});

app.get("/products", (req, res) => {
  console.log("req.query", req.query);
  fsp.readFile("./products.json", "utf8").then((data) => {
    const products = JSON.parse(data);
    if (req.query) {
      const { title } = req.query;
      const afterFilterProducts = products.filter((product) =>
        product.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(afterFilterProducts);
    } else {
      res.send(products);
    }
  });
});

app.listen(8000);
