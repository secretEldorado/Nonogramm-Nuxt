const bodyParser = require('body-parser')
const app = require('express')()
const { Sequelize, DataTypes, Op } = require('sequelize')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const sequelize = new Sequelize(process.env.MYSQL_DB,process.env.MYSQL_NAME,process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
})
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_NAME,
  password: process.env.MYSQL_PASSWORD 
})
const User = sequelize.define("user", {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  user_name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false
  }
},{
  tableName: 'user'
})
const Level = sequelize.define("level", {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
  title: {
      type: DataTypes.STRING,
      allowNull: false
  },
  user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
  },
  color: {
      type: DataTypes.STRING,
      allowNull: false
  },
  body: {
      type: DataTypes.TEXT,
      allowNull: false
  },
  column:{
      type: DataTypes.INTEGER,
      allowNull: false
  },
  row: {
      type: DataTypes.INTEGER,
      allowNull: false
  }
},{
  tableName: 'level'
})
User.hasMany(Level,{
  foreignKey: 'user_id'
})
Level.belongsTo(User,{
  foreignKey: 'user_id'
})
// Please do not use associate here it doesn't work 
app.use(bodyParser.json())

app.get('/init', async (req, res) => {
  try {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB};`)
    await User.sync()
    await Level.sync()
    let firstUser = await User.findAll({
      where: {
        id:1
      }
    })
    const password = await bcrypt.hash("campus09", 12)
    if(firstUser.length === 0){
      User.create({
        name:"mark",
        user_name:"ninjaboy13",
        password
      })
      await User.sync()
      firstUser = await User.findAll({
        where: {
          id:1
        }
      })
    }
    let initialLevel = await Level.findAll()
    if(initialLevel.length === 0){
      Level.bulkCreate([
        {
          user_id: firstUser[0].dataValues.id,
          color: '1',
          column: 5,
          row: 5,
          body: '11000,11001,01111,01001,01001',
          title: 'simple one'
        },
        {
          user_id: firstUser[0].dataValues.id,
          color: '1',
          column: 10,
          row: 10,
          body: '0011000000,0111101000,1000010100,0011010110,0111111111,0111111101,0111111111,0111111011,0011110110,0001111100',
          title: 'a little bit more complex'
        },
        {
          user_id: firstUser[0].dataValues.id,
          color: '1',
          column: 7,
          row: 5,
          body: '1100011,0100101,0111101,0100100,0100110',
          title: 'a 7x5 puzzle'
        }
      ])
    }
    res.send({
      msg: "database perfectly initalised"
    })
  } catch (error) {
    return res.status(400).json({ 
      msg: "error in initialising the Database",
      title: error,
      body: error.message
    })
  }
})

app.get('/getLevel/:id', async (req, res) => {
  try {
    const level = await Level.findOne({
      where: {
        id: req.params.id
      }
    })
    res.json({
      title: level.dataValues.title,
      body: level.dataValues.body,
      color: level.dataValues.color,
    })
  } catch (error) {
    return res.status(400).json({ 
      msg: "error finding the Level",
      title: error,
      body: error.message
    })
  }
})

app.get('/getLevel', async (req, res) => {
  try {
    let levels
    if(req.query.range){
      const range = req.query.range.split('-')
      levels = await Level.findAll({
        include: {
          model: User
        },
        where: {
          column: {
            [Op.between]: [range[0], range[1]]
          }
        }
      })
    }
    else {
      levels = await Level.findAll({
        include: {
          model: User
        }
      })
    }
    if (levels.length === 0) {
      throw new Error("levels can't be found in the database")
    }
    const data = []
    levels.forEach(level => {
      const leveldata = level.dataValues.body.split(",")
      const length = leveldata[0].length
      const height = leveldata.length
      data.push({
        id: level.id,
        title: level.dataValues.title,
        color: level.dataValues.color,
        length,
        height,
        userName: level.dataValues.user.user_name
      })
    })
    res.json(data)
  } catch (error) {
    return res.status(400).json({ 
      msg: "error finding the Levels",
      title: error,
      body: error.message
    })
  }
})

app.post('/signIn', async (req, res) => {
  const { name, username, password } = req.body
  try{
    const exsistUser = await User.findOne({
      where:{
        user_name: username 
      }
      })
    console.log(exsistUser)
    if(exsistUser) {
      return res.status(409).json({
        msg: "error creating user",
        title: "UserException",
        body:"User already existed"
      })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({
      name: name,
      user_name: username,
      password: hashedPassword
    })
    User.sync()
    const createdUser = await User.findOne({
      where: {
        user_name: username
      }
    })
    if(createdUser) {
      res.status(200).json({
        msg: "User created",
        user: { id: createdUser.id, username: createdUser.user_name },
      })
    }
    else {
      throw new Error("Error in finding the new user in the db")
    }
  } catch (error) {
    return res.status(500).json({ 
      msg: "error creating user",
      title: error,
      body: error.message
    })
  }
})

let currentUser
app.post('/logIn', async (req, res) => {
  const { username, password } = req.body
  try{
    const user = await User.findOne({
      where: {
        user_name: username
      }
    })
    if(!user) {
      return res.status(401).json({
        msg: "error logging in",
        title: "UserException",
        body:"User not found"
      })
    }
    currentUser = user
    const comparePassword = await bcrypt.compare(password, user.password)
    if(!comparePassword) {
      return res.status(401).json({
        msg: "error logging in",
        title: "PasswordException",
        body:"Password do not match!"
      })
    }

    jwt.sign({ username: user.user_name }, "expressnuxtsecret", { expiresIn: "10m" }, (err, token) => {
      res.status(200).json({
          token
      })})
  } catch (error) {
    return res.status(500).json({ 
      msg: "error logging in",
      title: error,
      body: error.message
    })
  }
})

app.get('/user', async(req, res) => {
  const exsistUser = await User.findOne({
    where:{
      user_name: currentUser.dataValues.user_name 
    }
  })
  res.json({
    user: exsistUser
  })
})

app.post('/createLevel',verifytoken, async(req, res) => {
  const { body, color, title, user_id } = req.body
  jwt.verify(req.token, "expressnuxtsecret", (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      const leveldata = body.split(",")
      const length = leveldata[0].length
      const height = leveldata.length
      Level.create({
        user_id,
        color,
        body,
        title,
        column: length,
        row: height
      })
      res.json({
        msg: 'Level created...',
        authData
      })
    }
  })
})

function verifytoken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'] 
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ')
      // Get token from array
      const bearerToken = bearer[1]
      // Set the token
      req.token = bearerToken
      // Next middleware
      next()
  } else {
      //Forbidden
      res.sendStatus(403);
  }
}

module.exports = app