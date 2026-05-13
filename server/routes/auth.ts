import { Router } from 'express';
import multer from 'multer';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
	fileFilter: (_req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowed.includes(file.mimetype)) {
			return cb(new Error('Invalid file type'));
		}
		return cb(null, true);
	},
});

// Rotte pubbliche (no auth required)
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/verify-username', authController.verifyUsername);
router.post('/verify-email', authController.verifyEmail);
router.post('/signout', authController.signout);

// Rotte protette (auth required)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/me', authMiddleware, authController.getMe);
router.post('/avatar', authMiddleware, upload.single('avatar'), authController.uploadAvatar);

export default router;
