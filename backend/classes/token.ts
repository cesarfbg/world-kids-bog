import jwt from 'jsonwebtoken';

export default class Token {

    private static SEED: string = process.env.TOKEN_SEED;
    private static expiration = (process.env.TOKEN_EXPIRATION);

    constructor() {}

    static getJwtToken( payload: any ): string {
        return jwt.sign({user: payload}, this.SEED, {expiresIn: this.expiration});
    }

    static verifyToken( userToken: string ) {
        return jwt.verify(userToken, this.SEED);
    }

}