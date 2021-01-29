const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema(
  {
    descripcion: {
      type: String,
      unique: true,
      required: [true, 'La descripción es obligatoria'],
    },
    producto: { required: true, type: Schema.Types.ObjectId, ref: 'Producto' },
    usuario: { required: true, type: Schema.Types.ObjectId, ref: 'Usuario' },
  },
  { timestamps: {} }
);

CategoriaSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

CategoriaSchema.pre('find', function () {
  this.populate('usuario', 'first_name img');
  this.populate('producto', 'nombre');
  this.sort({ descripcion: 1 });
  this.collation({ locale: 'en', strength: 2 });
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
