import { Router } from 'express';
import {
  createProduct,
  getBestSellerProducts,
  getNewArrivalProducts,
  getProduct,
  getProducts,
} from '../controllers/product.js';

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/new-arrival', getNewArrivalProducts);
router.get('/best-seller', getBestSellerProducts);
router.get('/:slug', getProduct);

export default router;
