const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://gilsonquezada:qwMH1g6vGRplmoD0@cluster0.uhbvmbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
           // useNewUrlParser: true,
            //useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
