import Product from '../models/product.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/index.js';
import path from 'path';

export const createProduct = async () => {};
// ######################################################

export const getAllProducts = async (req, res) => {
  const { newarrival, bestseller } = req.query;
console.log('ammmmmmmmmmmmmmmmm');
  const queryObject = {};

  if (newarrival) {
    queryObject.newarrival = newarrival === 'true' ? true : false;
  }
  if (bestseller) {
    queryObject.bestseller = bestseller === 'true' ? true : false;
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const products = await Product.find({}).skip(skip).limit(limit);

  res.status(StatusCodes.OK).json({ products, count: products.length });
};
// ######################################################

export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(req.query);
    const product = await Product.findOne({ slug });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'something went wrong' });
  }
};
// ######################################################

export const getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort('-createdAt').limit(6);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'something went wrong' });
  }
}
// ######################################################

export const getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort('-sold').limit(6);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'something went wrong' });
  }
}
// ######################################################

export const updateProduct = () => {};
// ######################################################

export const deleteProduct = () => {};
// ######################################################

export const uploadImage = () => {};