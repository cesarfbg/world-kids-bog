import cors from 'cors';
require('./config/config');
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Server from './classes/server';
import userRoutes from './routes/user';
import partnerRoutes from './routes/partner';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import applicationRoutes from './routes/application';

const initServer = async () => {

    // Server init
    const server = new Server();

    // Middlewares
    server.app.use(bodyParser.urlencoded({ extended: true }));
    server.app.use(bodyParser.json());
    server.app.use(cors());

    // Endpoint routes
    server.app.use('/user', userRoutes);
    server.app.use('/application', applicationRoutes);
    server.app.use('/category', categoryRoutes);
    server.app.use('/partner', partnerRoutes);
    server.app.use('/product', productRoutes);

    // DB connection
    const uriDB = process.env.URIDB;
    mongoose.connect(uriDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
        if (err) {
            throw err;
        }
        console.log('Successfully created DB connection.');
    });

    // Start server listening on specified port
    if (await server.start() !== false) {
        console.log(`Server initialized on port ${server.port}.`);
    } else {
        console.log(`Something went wrong while trying to start the server.`);
    }

};

initServer();
