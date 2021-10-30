import Product from '../models/product.js'

export const createProduct = async () => {};
// ######################################################

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'something went wrong' });
  }
};
// ######################################################

export const getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(req.query);
    const product = await Product.findOne({ slug });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "something went wrong" });
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