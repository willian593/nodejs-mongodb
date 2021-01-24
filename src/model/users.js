const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido',
};

const UsuariosSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, 'El {PATH} es requerido'],
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
      default: 'Enriquez Lopez',
    },
    password: {
      type: String,
      required: [true, 'El {PATH} es requerido'],
    },
    email: {
      type: String,
      required: true,
      unique: true, // es unico no se puede repetir
      trim: true,
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: 'USER_ROLE',
      enum: rolesValidos,
    },
    state: {
      type: Boolean,
      default: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
    facebook: {
      type: Boolean,
      default: false,
    },
    instagram: {
      type: Boolean,
      default: false,
    },
    twitter: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: {} }
);

UsuariosSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

UsuariosSchema.plugin(uniqueValidator, {
  message: 'El {PATH} debe de ser único',
});

// // esquema ordenado
// UsuariosSchema.statics.structure = (res) => {
//   const sortSchema = ({
//     uid,
//     first_name,
//     last_name,
//     password,
//     email,
//     img,
//     role,
//     state,
//     google,
//     facebook,
//     instagram,
//     twitter,
//   }) => ({
//     uid,
//     first_name,
//     last_name,
//     password,
//     email,
//     img,
//     role,
//     state,
//     google,
//     facebook,
//     instagram,
//     twitter,
//   });

//   return Array.isArray(res) ? res.map(sortSchema) : sortSchema(res);
// };

module.exports = model('Usuario', UsuariosSchema);
