var express = require("express");
var router = express.Router();
const fs = require("fs");

router.use(express.json());

let lastId = 0;

router.get("/", function (req, res) {
  fs.readFile("./data/note.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Terjadi Kesalahan pada server!" });
    } else {
      const jsonData = JSON.parse(data);

      if (jsonData && jsonData.length > 0) {
        res.status(200).json({ status: true, data: jsonData });
      } else {
        res.status(200).json({ status: true, data: jsonData });
      }
    }
  });
});

router.get("/:id", function (req, res) {
  const id = req.params.id;

  fs.readFile("./data/note.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Terjadi Kesalahan pada server!" });
    } else {
      let notes = JSON.parse(data);

      // Cari note dengan id yang sesuai
      const note = notes.find((note) => note.id === parseInt(id));

      if (!note) {
        res.status(404).json({ message: "Data tidak ditemukan" });
      } else {
        res.status(200).json(note);
      }
    }
  });
});

router.post("/", function (req, res) {
  const data = req.body;

  if (Array.isArray(data) && data.length > 0) {
    let jsonData = [];

    // Generate id untuk setiap data
    data.forEach((item) => {
      const id = ++lastId;
      jsonData.push({ id, ...item });
    });

    fs.writeFile("./data/note.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
      } else {
        res
          .status(201)
          .json({ status: 201, message: "Data berhasil disimpan" });
      }
    });
  } else if (Object.keys(data).length > 0) {
    const { title, author } = data;

    if (title && author) {
      const newData = { id: ++lastId, title, author };
      fs.writeFile("./data/note.json", JSON.stringify(newData), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Terjadi kesalahan pada server" });
        } else {
          res
            .status(201)
            .json({ status: 201, message: "Data berhasil disimpan" });
        }
      });
    } else {
      res.status(400).json({ message: "Data tidak lengkap" });
    }
  } else {
    res.status(400).json({ message: "Data tidak lengkap" });
  }
});

router.delete("/:id", function (req, res) {
  const id = req.params.id;

  fs.readFile("./data/note.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    } else {
      let notes = JSON.parse(data);

      // Ubah objek notes menjadi array
      notes = Array.isArray(notes) ? notes : [notes];

      // Cari note dengan id yang sesuai
      const index = notes.findIndex((note) => note.id === parseInt(id));

      if (index === -1) {
        res.status(404).json({ message: "Data tidak ditemukan" });
      } else {
        // Hapus note dengan id yang sesuai
        notes.splice(index, 1);

        // Simpan data ke file
        fs.writeFile("./data/note.json", JSON.stringify(notes), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Terjadi kesalahan pada server" });
          } else {
            res.status(200).json({ message: "Data berhasil dihapus" });
          }
        });
      }
    }
  });
});

module.exports = router;
