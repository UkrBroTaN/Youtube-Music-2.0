const uploadInput = document.getElementById("upload");
const uploadBtn = document.getElementById("uploadBtn");
const trackList = document.getElementById("trackList");
const audio = document.getElementById("audio");

uploadBtn.addEventListener("click", async () => {
    const file = uploadInput.files[0];
    if (!file) return alert("Вибери файл!");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        loadTracks();
    } else {
        alert("Помилка при завантаженні");
    }
});

async function loadTracks() {
    const response = await fetch("/tracks");
    const tracks = await response.json();
    
    trackList.innerHTML = "";
    tracks.forEach(track => {
        const li = document.createElement("li");
        li.textContent = track;
        li.addEventListener("click", () => {
            audio.src = `/music/${track}`;
            audio.play();
        });
        trackList.appendChild(li);
    });
}

loadTracks();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const upload = multer({ dest: "music/" });

app.use(express.static("public"));

app.post("/upload", upload.single("file"), (req, res) => {
    const oldPath = req.file.path;
    const newPath = path.join("music", req.file.originalname);

    fs.rename(oldPath, newPath, (err) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
    });
});

app.get("/tracks", (req, res) => {
    fs.readdir("music", (err, files) => {
        if (err) return res.sendStatus(500);
        res.json(files);
    });
});

app.use("/music", express.static("music"));

app.listen(port, () => console.log(`Сервер працює на порту ${port}`));
