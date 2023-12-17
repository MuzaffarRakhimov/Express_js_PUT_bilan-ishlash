const express = require("express");
const Joi = require("joi");
const app = express();
app.use(express.json());

const books = [
  { id: 1, name: "html-css" },
  { id: 2, name: "javascript" },
  { id: 3, name: "nodejs" },
  { id: 4, name: "express" },
];

app.post("/api/books", (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const book = {
    id: books.length + 1,
    name: req.body.name,
  };
  books.push(book);
  res.status(201).send(book);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) res.status(404).send("Berilgan IDga teng bolgan kitob topilmadi");
  res.send(book);
});

app.put("/api/books/:id", (req, res) => {
  // kitobni bazadan izlab topish
  // kitob mavjud bo'lmasa 404 qaytarish
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book)
    return res.status(404).send("Berilgan IDga teng bolgan kitob topilmadi");

  // agar kitob bo'lsa uni validatsiya qilish
  // agar so'rov validatsiyadan o'tmasa , 400 qaytarish

  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // kitobni yangilash
  book.name = req.body.name;
  // yangilangan kitobni qaytarish
  res.send(book);
});

function validateBook(book) {
  const bookSxema = {
    name: Joi.string().required().min(3),
  };
  return Joi.validate(book, bookSxema);
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`${port} portni eshitishni boshladim...`);
});
