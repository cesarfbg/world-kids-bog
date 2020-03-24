import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: string,
    status: boolean,
    img: string
}

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'Invalid provided role.'
};

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        required: [true, 'Role is required.'],
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: 'default'
    }
});

userSchema.methods.toJSON = function() {
    let model = this;
    let modelObject = model.toObject();
    delete modelObject.password;
    delete modelObject.__v;
    return modelObject;
};

userSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con el correo <b>{VALUE}</b>' });

export const User = model<IUser>('User', userSchema);