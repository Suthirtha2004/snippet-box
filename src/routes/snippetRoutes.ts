import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createSnippetSchema, updateSnippetSchema } from "../schemas/snippetSchema.js";
import { createSnippet, getOneSnippet, getSnippet, updateSnippet } from "../controllers/snippetController.js";

const router = express.Router();



router.post('/create',
            authMiddleware,
            validateRequest(createSnippetSchema),
            createSnippet
        )

router.get('/fetch',
            authMiddleware,
            getSnippet
)        

router.get('/fetch/:id',
            authMiddleware,
            getOneSnippet
)

router.patch('/update',
              authMiddleware,
              validateRequest(updateSnippetSchema),
              updateSnippet
)

router.p

export router;