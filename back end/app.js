// import core modules...

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const http = require('http'); // for sockets...
const fileUpload = require('express-fileupload'); // Import the express-fileupload middleware

const userRouter = require('./router/user');
const chatRouter = require('./router/chat');
const groupRouter = require('./router/group');

const User = require('./model/user');
const Chat = require('./model/chat');
const Group = require('./model/group');
const UserGroup = require('./model/usergroup');

const app = express();

app.use(cors())

const server = http.createServer(app); // for sockets...
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    }
});

app.use(bodyParser.json());

app.use(fileUpload());

app.use('/user',userRouter);

app.use('/chat',chatRouter);

app.use('/group',groupRouter);

User.hasMany(Chat);
Chat.belongsTo(User);

Group.belongsToMany(User , {through : UserGroup});
User.belongsToMany(Group , {through : UserGroup});

Group.hasMany(Chat);
Chat.belongsTo(Group);

// Start the cron job
const cronJob = require('./cornjobs/cornJobs');
cronJob.cronJob.start();

sequelize
// .sync({force: true})
.sync()
.then(()=>{
    console.log('tabels created');
    server.listen(4000, ()=>{
        console.log('server is running on port 4000');
    }); // change app to server for sockets...
})
.catch(err=> console.log(err));
 
io.on('connection', (socket)=>{
    console.log('socket.id >>>>', socket.id);
    socket.on('send-message', (message)=>{
            socket.broadcast.emit('receive-message', message);
        console.log(message);
    })
    socket.on('join-room', (option, cb)=>{
        socket.join(option);
        cb(`joined ${option}`)
    })
});
 
 
 