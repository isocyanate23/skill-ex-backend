const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//var socketIO = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;
//const io = socketIO(server);

connectDB();

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});