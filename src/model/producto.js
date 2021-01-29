const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es necesario'],
      trim: true,
    },
    priceUni: {
      type: Number,
      required: [true, 'El precio únitario es necesario'],
    },
    descripcion: { type: String, required: false, trim: true },
    img: { type: String },
    disponible: { type: Boolean, required: true, default: true },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  },
  { timestamps: {} }
);

ProductoSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

ProductoSchema.pre('find', function () {
  this.populate('usuario ', 'first_name img');
  this.populate('categoria', 'descripcion -usuario');
  this.sort({ nombre: 1 });
  this.collation({ locale: 'en', strength: 2 });
});

module.exports = mongoose.model('Producto', ProductoSchema);
