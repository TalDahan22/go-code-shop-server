import * as fsp from "fs/promises";
import * as http from "https";

function readFiles(fileName) {
  fsp
    .readFile(fileName, "utf-8")
    .then((word) => {
      fsp.readFile(`./translations.json`, "utf-8").then((data) => {
        const array = JSON.parse(data);
        const foundWord = array.find((item) => item.english === word);
        if (foundWord !== undefined) {
          fsp.writeFile("./he.txt", foundWord.hebrow);
        }
      });
    })
    .catch((err) => console.log("error", err));
}

// function writeFiles(fileName, data) {
//   fsp
//     .writeFile(`${fileName}`, `${data}`)
//     .then(() => console.log("tirgamti"))
//     .catch((err) => console.log(err));
// }

readFiles("./en.txt");
// writeFiles("he.txt");

http
  .createServer((request, Response) => {
    readFiles("en.txt");
    Response.end("success");
  })
  .listen(8000);
