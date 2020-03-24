import express from 'express';

export default class Server {

    public app: express.Application;
    public port: number = Number(process.env.PORT);

    constructor() {
        this.app = express();
    }

    async start() {
        try {
            return this.app.listen( this.port );
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
