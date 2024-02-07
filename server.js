
const express = require('express')
const app = express()
const database = require("./database")
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/poses', async (req, res) => {
    const poses = await database.getPoses()
    res.render("poses.ejs", {
        poses,});
})

app.get('/posesfilter', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const searchDifficulty = req.query.searchDifficulty;
    const poses = await database.getPosesByFilter(searchTerm, searchDifficulty)
    res.render("poses.ejs", {
        poses,});
})

app.get('/poses/:id', async (req, res) => {
    const id = req.params.id
    if (id) {
    const pose = await database.getPose(id)
    console.log(pose)
    if(!pose){
        res.status(404).render("pose404.ejs")
        return
    }
    res.render("pose.ejs", {
        pose,});
    }
})

app.get("/addPose", (req, res) => {
    res.render("addPose.ejs")
})

app.post("/inputPose", async (req, res) => {
    const data = req.body
    await database.addPose(data)
    res.redirect("/poses");
})

app.post("/poses/:id/delete", async (req, res) => {
    const id = req.params.id
    await database.deletePose(id)

    res.redirect("/poses");
})

app.use(express.static("public"))

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})