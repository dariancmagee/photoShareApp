const express = require('express');
const app = express();
const port = 3030;
const Sequelize = require('sequelize');
const { User, Photo } = require('./models');


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.get("/users", async (req,res) =>{
    const users = await User.findAll({
        attributes: ['lastName']
    });
    res.json(users);
});

app.get("/users/photos", async (req, res) => {
    const users = await User.findAll({
        include: [
        {
            model: Photo,
        },
        ],
    });
    res.json(users);
});


// Find row by ID (pk == primary key)

app.get("/users/:id", async (req, res) => {
    try {
        const userID = req.params.id;
        const oneUser = await User.findByPk(userID);
        res.json(oneUser);
    }
    catch (e)  {
        console.log(e);
        res.status.apply(404).json ({
            message: "User not found"
        });
    }
});


// Search users

app.post("/users/search", async (req, res) => {
    // console.log(req.body);
    const users = await User.findAll({
        where: {
            [Sequelize.Op.or]: [
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                },
            ],
        },
        include: [
            {
                model: Photo,
            },
        ],
    });
    res.json(users);
})

// Update Existing User

app.post("/users/:id", async (req, res) => {
    const { id } = req.params;
    
    // Assuming that `req.body` is limited to
    // the keys firstName, lastName, and email
    const updatedUser = await User.update(req.body, {
      where: {
        id,
      },
    });
    
    res.json(updatedUser);
});

app.post("/users", async (req, res) => {
    // req.body contains an Object with firstName, lastName, email
    const { firstName, lastName, email } = req.body;
    const newUser = await User.create({
        firstName,
        lastName,
        email
    });
    
    // Send back the new user's ID in the response:
    res.json({
        id: newUser.id
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})