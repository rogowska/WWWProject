const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'Oliwka',
  password: '',
  database: 'my_db'
}).promise()


async function getPoses(){
    const [rows] = await pool.query("SELECT * from poses")
    return rows
}
exports.getPoses = getPoses 

async function getPosesByFilter(searchTerm, searchDifficulty){
    if (searchTerm) {
        searchTerm = '%' + searchTerm + '%'
        if(searchDifficulty !== "Choose difficulty"){
            const [rows] = await pool.query("SELECT * from poses where difficulty_level = ? and (title like ? or description like ?)", [searchDifficulty, searchTerm, searchTerm])
            return rows
        }
        else{
            const [rows] = await pool.query("SELECT * from poses where title like ? or description like ?", [searchTerm, searchTerm])
            return rows
        }
    }
    else{
        if(searchDifficulty !== "Choose difficulty"){
            const [rows] = await pool.query("SELECT * from poses where difficulty_level = ?", [searchDifficulty])
            return rows
        }
        else{
            const [rows] = await pool.query("SELECT * from poses")
            return rows
        }
    }
}
exports.getPosesByFilter = getPosesByFilter

async function getPose(id) {
    const [rows] = await pool.query("SELECT * FROM poses where id = ?", [id])
    console.log("Baza danych " + rows.length)
    return rows[0]
}
exports.getPose = getPose

async function deletePose(id) {
    await pool.query("DELETE FROM poses where id = ?", [id])
}
exports.deletePose = deletePose

async function addPose(pose, filename) {
    await pool.query("INSERT INTO poses(title, difficulty_level, image, description) VALUES(?, ?, ?, ?)", [pose.title, pose.difficulty_level, filename, pose.description])
}
exports.addPose = addPose
