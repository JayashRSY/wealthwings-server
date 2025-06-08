import express from 'express';
import multer from 'multer';
import { recommendCard, uploadStatement, getStatements } from '../controllers/card.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/recommend', recommendCard);
// Pass the field name 'statement' that you expect from the client
router.post('/upload-statement', upload.single('statement'), uploadStatement);
router.get('/statements', getStatements);

export default router;
