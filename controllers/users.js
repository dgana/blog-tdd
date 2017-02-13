const mongoose = require('mongoose')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const Users = require('../models/users')

const userController = {
  path: (req, res) => {
    const path = {
      users_url: 'http://localhost:3000/api/users',
      blogs_url: 'http://localhost:3000/api/blogs'
    }
    res.json(path)
  },
  addUsers: (req, res) => {
    Users.create({
      username: req.body.username,
      password: passwordHash.generate(req.body.password)
    }, (err, user) => {
      if (err) throw err
      res.json(user)
    })
  },
  signIn: (req, res) => {
    if(!req.body.username) {
      res.json({ msg: 'Please input your username!'})
    }
    if(!req.body.password) {
      res.json({ msg: 'Please input your password!'})
    }

    Users.find({
      username: req.body.username
    }, (err, user) => {
      if(!passwordHash.verify(req.body.password, user.password)) {
        res.send('Invalid Password!')
      } else {
        let myToken = jwt.sign({
          id: user._id,
          username: user.username
        }, 'secret', {
          expiresIn: '24h'
        })
        res.json(myToken)
      }
    })
  },
  getAllUsers: (req,res) => {
    Users.find((err, users) => {
      if (err) throw err
      res.json(users)
    })
  },
  deleteUser: (req, res) => {
    Users.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) throw err
      res.json(user)
    })
  }
}

module.exports = userController
