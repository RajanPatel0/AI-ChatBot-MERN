import {Router} from 'express';
import { verifyToken } from '../utils/token-manager.js';
import { chatCompletionValidator } from '../utils/validators.js';
import { generateChatCompletion } from '../controllers/chat-controllers.js';
import { validate } from '../utils/validators.js';

const chatRoutes=Router();

chatRoutes.post("/new",validate(chatCompletionValidator), verifyToken, generateChatCompletion);

export default chatRoutes;