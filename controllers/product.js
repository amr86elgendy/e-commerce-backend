import Product from '../models/product.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/index.js';
import slugify from 'slugify';
import path from 'path';

export const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  req.body.slug = slugify(req.body.name);

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

// ######################################################

export const getAllProducts = async (req, res) => {
  let { company, featured, name, sort, page, limit } = req.query;

  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    if (sort === 'createdAt') {
      sort = '-createdAt';
    } else if (sort === 'sold') {
      sort = '-sold';
    }
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  }
  // Pagination
  if (page && limit) {
    
    page = Number(page);
    limit = Number(limit);
    skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
  }
  // Limit only
  if (limit && !page) {
    limit = Number(limit);
    result = result.limit(limit);
  }

  const products = await result;

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

// ######################################################

export const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name' },
  }); // virtuals

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

// ######################################################

export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

// ######################################################

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};

// ######################################################

export const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    );
  }
  const dirname = path.resolve(path.dirname(''));
  const imagePath = path.join(
    dirname,
    './public/uploads/' + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
