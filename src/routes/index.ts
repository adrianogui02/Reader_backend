import express from 'express';
import { uploadController } from '../controllers/uploadController';
import confirmController from '../controllers/confirmController';
import listController from '../controllers/listController';

const router = express.Router();

router.post('/upload', uploadController);
router.patch('/confirm', confirmController);
router.get('/:customer_code/list', listController);

export default router;
