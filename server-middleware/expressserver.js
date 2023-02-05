const bodyParser = require('body-parser')
const app = require('express')()
const { Sequelize, DataTypes, Op, where } = require('sequelize')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const sequelize = new Sequelize(process.env.MYSQL_DB,process.env.MYSQL_NAME,process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
})
const queryInterface = sequelize.getQueryInterface()
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
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: true
  }
},{
  tableName: 'level'
})
const LikeLevel = sequelize.define("like_level", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
  },
  level_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'level',
      key: 'id'
    }
  }
},{
  tableName: 'like_level',
  paranoid: true, 
})
const Comment = sequelize.define("comment",{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
  },
  level_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'level',
      key: 'id'
    }
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'comment'
})
const LikeComment = sequelize.define("like_comment",{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
  },
  comment_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'comment',
      key: 'id'
    }
  },
},{
  tableName: 'like_comment',
  paranoid: true,
})

const Completed = sequelize.define("completed", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
  },
  level_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'level',
      key: 'id'
    }
  }
},{
  tableName: 'completed', 
}) 
User.hasMany(Level,{
  foreignKey: 'user_id',
  onDelete:'CASCADE'
})
Level.belongsTo(User,{
  foreignKey: 'user_id'
})

Level.hasMany(Comment,{
  foreignKey: 'level_id',
  onDelete:'CASCADE'
})
Comment.belongsTo(Level,{
  foreignKey: 'level_id'
})
User.hasMany(Comment,{
  foreignKey: 'user_id',
  onDelete:'CASCADE',
})
Comment.belongsTo(User,{
  foreignKey: 'user_id'
})

User.hasMany(LikeComment,{
  foreignKey: 'user_id',
  onDelete:'CASCADE',
})
LikeComment.belongsTo(User,{
  foreignKey: 'user_id'
})
Comment.hasMany(LikeComment,{
  foreignKey: 'comment_id',
  onDelete:'CASCADE'
})
LikeComment.belongsTo(Comment,{
  foreignKey: 'comment_id'
})

User.hasMany(LikeLevel,{
  foreignKey: 'user_id',
  onDelete:'CASCADE',
})
LikeLevel.belongsTo(User,{
  foreignKey: 'user_id'
})
Level.hasMany(LikeLevel,{
  foreignKey: 'level_id',
  onDelete:'CASCADE'
})
LikeLevel.belongsTo(Level,{
  foreignKey: 'level_id'
})

User.hasMany(Completed,{
  foreignKey: 'user_id',
  onDelete:'CASCADE',
})
Completed.belongsTo(User,{
  foreignKey: 'user_id'
})
Level.hasMany(Completed,{
  foreignKey: 'level_id',
  onDelete:'CASCADE'
})
Completed.belongsTo(Level,{
  foreignKey: 'level_id'
})

// Please do not use associate here it doesn't work 
app.use(bodyParser.json())

app.get('/init', async (req, res) => {
  try {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB};`)
    await User.sync()
    await Level.sync()
    await Comment.sync()
    await LikeComment.sync()
    await LikeLevel.sync()
    await Completed.sync()
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
    const description = await queryInterface.describeTable("level")
    if(!description.mode){
      queryInterface.addColumn("level", "mode", { 
        type: DataTypes.STRING,
        allowNull: true
      })
    }
    let additionalLevel = await Level.findAll({
      where:{
        mode: "boss"
      }
    })
    console.log(additionalLevel)
    if(additionalLevel.length === 0){
      Level.bulkCreate([
        {
          user_id: firstUser[0].dataValues.id,
          color: '1',
          column: 15,
          row: 15,
          body: '000000000111000,000000001111100,000000011110111,000000011111110,000000001111100,000000000111000,000000001111100,100000111111110,111001110001110,111111101110110,011111011110110,011111111001100,001111111111000,000011011100000,000000111111000',
          title: 'Boss Level 1',
          mode: 'boss'
        },
        {
          user_id: firstUser[0].dataValues.id,
          color: '1,#FFFF00,#FFA200,#00B3FF',
          column: 10,
          row: 10,
          body: '0002222000,0022222200,0022122200,0332122200,3333222220,0022222222,0222222222,4222222222,0422222224,0044444440',
          title: 'Boss Level 2',
          mode: 'boss'
        },
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
      if(req.query.username){
        levels = await Level.findAndCountAll({
          include:[ 
              {model: User,
                where: {
                  user_name:{
                    [Op.like]: '%'+req.query.username+'%'
                  }
                } 
              },
              {model:LikeLevel},
              {model:Completed}
            ],
          where: {
            [Op.or]: {
              column: {
                [Op.between]: [range[0], range[1]]
              },
              row: {
                [Op.between]: [range[0], range[1]]
              }
            },
            mode:{
              [Op.eq] : null
            }
          },
          distinct:true,
          limit:20,
          offset: (req.query.page-1)*20
        })
      }
      else if(req.query.title){
        levels = await Level.findAndCountAll({
          include:[ 
              {model: User},
              {model:LikeLevel},
              {model:Completed}
            ],
          where: {
            title:{
              [Op.like]: '%'+req.query.title+'%'
            },
            [Op.or]: {
              column: {
                [Op.between]: [range[0], range[1]]
              },
              row: {
                [Op.between]: [range[0], range[1]]
              }
            },
            mode:{
              [Op.eq] : null
            }
          },
          distinct:true,
          limit:20,
          offset: (req.query.page-1)*20
        })
      }
      else {
        levels = await Level.findAndCountAll({
          include:[ 
              {model: User},
              {model:LikeLevel},
              {model:Completed}
            ],
          where: {
            [Op.or]: {
              column: {
                [Op.between]: [range[0], range[1]]
              },
              row: {
                [Op.between]: [range[0], range[1]]
              }
            },
            mode:{
              [Op.eq] : null
            }
          },
          distinct:true,
          limit:20,
          offset: (req.query.page-1)*20
        })
      }
    } else if(req.query.user_id){
      levels = await Level.findAndCountAll({
        include: [ 
          {model: User},
          {model:LikeLevel},
          {model:Completed}
        ],
        distinct:true,
        where: {
          user_id: req.query.user_id,
          mode:{
            [Op.eq] : null
          }
        }
      })
    } else if(req.query.title) {
      levels = await Level.findAndCountAll({
        include: [ 
          {model: User},
          {model:LikeLevel},
          {model:Completed}
        ],
        where: {
          title:{
            [Op.like]: '%'+req.query.title+'%'
          },
          mode:{
            [Op.eq] : null
          }
        },
        distinct:true,
        limit:20,
        offset: (req.query.page-1)*20
      })
    } else if(req.query.username) {
      levels = await Level.findAndCountAll({
        include: [ 
          {model: User,
            where: {
              user_name:{
                [Op.like]: '%'+req.query.username+'%'
              }
            } 
          },
          {model:LikeLevel},
          {model:Completed}
        ],
        where: {
          mode:{
            [Op.eq] : null
          }
        },
        distinct:true,
        limit:20,
        offset: (req.query.page-1)*20
      })
    }
    // for some odd reason mysql cannot use != or <> for queries
    else {
      levels = await Level.findAndCountAll({
        include: [ 
          {model: User},
          {model:LikeLevel},
          {model:Completed}
        ],
        where: {
          mode:{
            [Op.eq] : null
          }
        },
        distinct:true,
        limit:20,
        offset: (req.query.page-1)*20
      })
    }
    if (levels.length === 0 || levels.count === 0) {
      throw new Error("levels can't be found in the database")
    }
    // console.log(levels)
    const data = []
    data.push({totalItem: levels.count})
    levels.rows.forEach(level => {
      const leveldata = level.dataValues.body.split(",")
      const length = leveldata[0].length
      const height = leveldata.length
      let ifUserLikedLevel = false
      let ifUserCompletedLevel = false
      level.dataValues.like_levels.forEach(like => {
        if(parseInt(req.query.loggedInUser_id) === like.user_id) {
          ifUserLikedLevel = true
        }
      })
      level.dataValues.completeds.forEach(complete => {
        if(parseInt(req.query.loggedInUser_id) === complete.user_id) {
          ifUserCompletedLevel = true
        }
      })
      data.push({
        id: level.id,
        title: level.dataValues.title,
        color: level.dataValues.color,
        length,
        height,
        userName: level.dataValues.user.user_name,
        user_id: level.dataValues.user.id,
        name: level.dataValues.user.name,
        likeCount: level.dataValues.like_levels.length,
        userLikedLevel: ifUserLikedLevel,
        userCompletedLevel: ifUserCompletedLevel
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

app.post('/likeLevel',verifytoken, (req, res) => {
  const { user_id, level_id } = req.body
  jwt.verify(req.token, "expressnuxtsecret", async (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      const already = await LikeLevel.findOne({
        where: {
          user_id,
          level_id
        }
      })
      if(already){
        LikeLevel.destroy({
          where: {
            user_id,
            level_id
          }
        })
        res.json({
          msg: 'Like for a Level deleted...',
          authData
        })
      } else{
        const userLikeOwnComment = await Level.findOne({
          where: {
            id: level_id,
            user_id
          }
        })
        if( userLikeOwnComment){
          return res.status(401).json({
            msg: "error liking level",
            title: "LikeLevelException",
            body:"User liked its own level"
          })
        }
        const ifAlreadyDeleted = await LikeLevel.findOne({
          where: {
            user_id,
            level_id
          },
          paranoid: false
        })
        if(ifAlreadyDeleted) {
          LikeLevel.restore({
            where: {
              user_id,
              level_id
            }
          })
        } else {
          LikeLevel.create({
            user_id,
            level_id
          })
        }
        res.json({
          msg: 'Like for a Level created...',
          authData
        })
      }
    }
  })
})

app.post('/signIn', async (req, res) => {
  const { name, username, password } = req.body
  try{
    const exsistUser = await User.findOne({
      where:{
        user_name: username 
      }
      })
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
  const already = await Level.findOne({
    where: {
      [Op.or]: {
        body,
        title
      }
    }
  })
  if(already){
    return res.status(409).json({
      msg: "error creating level",
      title: "LevelException",
      body:"Level already existed"
    })
  }
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
app.get('/getComments/:level_id', async(req, res) => {
  const id = req.params.level_id
  if(!id){
    return res.status(401).json({
      msg: "error creating comment",
      title: "CommentException",
      body:"No level ID"
    })
  } else{
    try {
      const comments = await Comment.findAll({
        include:[
          { model: User },
          { model: LikeComment}
        ],
        where: {
          level_id: id
        }
      })
      if (comments.length === 0) {
        throw new Error("comments can't be found in the database")
      }
      const data = []
      comments.forEach(comment => {
        let ifUserLikedComment = false
        comment.dataValues.like_comments.forEach(like => {
          if(parseInt(req.query.user_id) === like.user_id) {
            ifUserLikedComment = true
          }
        })
        data.push({
          id: comment.dataValues.id,
          body : comment.dataValues.body,
          userId: comment.dataValues.user.id,
          username: comment.dataValues.user.user_name,
          levelId: comment.dataValues.level_id,
          createdAt: moment(comment.dataValues.createdAt).format('D MMMM YYYY [at] HH:mm'),
          countLike: comment.dataValues.like_comments.length,
          userLikedComment: ifUserLikedComment
        })
      })
      res.json(data)
    } catch (error) {
      return res.status(400).json({ 
        msg: "error finding the Level",
        title: error,
        body: error.message
      })
    }
  }
})
app.post('/createComment',verifytoken, async(req, res) => {
  const { body, user_id, level_id } = req.body
  const already = await Comment.findOne({
    where: {
      body,
      user_id,
      level_id
    }
  })
  if(already){
    return res.status(409).json({
      msg: "error creating comment",
      title: "CommentException",
      body:"Comment already existed"
    })
  }
  if(body === ''){
    return res.status(401).json({
      msg: "error creating comment",
      title: "CommentException",
      body:"Comment has no body"
    })
  }
  jwt.verify(req.token, "expressnuxtsecret", (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      Comment.create({
        user_id,
        level_id,
        body
      })
      res.json({
        msg: 'Comment created...',
        authData
      })
    }
  })
})

app.post('/likeComment',verifytoken, (req, res) => {
  const { user_id, comment_id } = req.body
  jwt.verify(req.token, "expressnuxtsecret", async (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      const already = await LikeComment.findOne({
        where: {
          user_id,
          comment_id
        }
      })
      if(already){
        LikeComment.destroy({
          where: {
            user_id,
            comment_id
          }
        })
        res.json({
          msg: 'Like for a Comment deleted...',
          authData
        })
      } else{
        const userLikeOwnComment = await Comment.findOne({
          where: {
            id: comment_id,
            user_id
          }
        })
        if( userLikeOwnComment){
          return res.status(401).json({
            msg: "error liking comment",
            title: "LikeCommentException",
            body:"User liked its own comment"
          })
        }
        const ifAlreadyDeleted = await LikeComment.findOne({
          where: {
            user_id,
            comment_id
          },
          paranoid: false
        })
        if(ifAlreadyDeleted) {
          LikeComment.restore({
            where: {
              user_id,
              comment_id
            }
          })
        } else {
          LikeComment.create({
            user_id,
            comment_id
          })
        }
        res.json({
          msg: 'Like for a Comment created...',
          authData
        })
      }
    }
  })
})

app.post('/completedLevel',verifytoken, (req, res) => {
  const { user_id, level_id } = req.body
  jwt.verify(req.token, "expressnuxtsecret", async (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      const already = await Completed.findOne({
        where: {
          user_id,
          level_id
        }
      })
      if(already){
        res.json({
          msg: 'already finished that level...',
          authData
        })
      } else{
        Completed.create({
          user_id,
          level_id
        })
        res.json({
          msg: 'Level already Completed...',
          authData
        })
      }
    }
  })
})
app.get('/getBossLevel', async (req, res) => {
  try {
    const level = await Level.findOne({
      where: {
        mode: 'boss'
      },
      order: [
        Sequelize.fn( 'RAND' ),
      ]
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