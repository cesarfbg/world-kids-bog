// =================
//        Port
// =================
process.env.PORT = process.env.PORT || '3000';

// =================
//       URIDB
// =================
process.env.URIDB = process.env.URIDB || 'mongodb://localhost:27017/calierwebsiteDB';

// =================
//    Token SEED
// =================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'TEST-SEED-FOR-LOCAL-TESTING';

// =================
// Token Expiration
// =================
process.env.TOKEN_EXPIRATION = '3600'; // Seconds
