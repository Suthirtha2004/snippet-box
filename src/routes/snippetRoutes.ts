import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createSnippetSchema, updateSnippetSchema } from "../schemas/snippetSchema.js";
import { createSnippet, deleteSnippet, getOneSnippet, getSnippet, getSnippetVersion, restoreSnippet, updateSnippet } from "../controllers/snippetController.js";

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

router.delete('/delete/:id',
                authMiddleware,
                deleteSnippet
)

router.get('/fetchVersion/:versionId',
            authMiddleware,
            getSnippetVersion
)

router.post('/:id/versions/:versionId/restore',
             authMiddleware,
             validateRequest(updateSnippetSchema),
             restoreSnippet
            )






export default router;