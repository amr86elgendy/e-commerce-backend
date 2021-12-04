import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

// const reviewSchema = mongoose.Schema(
//   {
//     rating: { type: Number, required: true },
//     comment: { type: String, required: true },
//     user: {
//       type: ObjectId,
//       required: true,
//       ref: 'User',
//     },
//   },
//   { timestamps: true }
// );

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    slug: {
      type: String,
      required: true,
    },
    images: Array,
    brand: {
      type: String,
      required: [true, 'Please provide product brand'],
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    shipping: {
      type: Boolean,
      default: false,
    },
    // reviews: [reviewSchema],
    numReviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    colors: Array,
    quantity: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

productSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ product: this._id });
});

export default mongoose.model('Product', productSchema);
