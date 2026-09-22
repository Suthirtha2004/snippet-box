import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createSnippetSchema, updateSnippetSchema } from "../schemas/snippetSchema.js";
import { createSnippet, deleteSnippet, getOneSnippet, getSnippet, getSnippetVersion, restoreSnippet, updateSnippet } from "../controllers/snippetController.js";

const router2 = express.Router();



router2.post('/create',
            authMiddleware,
            validateRequest(createSnippetSchema),
            createSnippet
        )

router2.get('/fetch',
            authMiddleware,
            getSnippet
)        

router2.get('/fetch/:id',
            authMiddleware,
            getOneSnippet
)

router2.patch('/update/:id',
              authMiddleware,
              validateRequest(updateSnippetSchema),
              updateSnippet
)

router2.delete('/delete/:id',
                authMiddleware,
                deleteSnippet
)

router2.get('/fetchVersion/:id/versions/:versionId',
            authMiddleware,
            getSnippetVersion
)

router2.post('/:id/versions/:versionId/restore',
             authMiddleware,
             validateRequest(updateSnippetSchema),
             restoreSnippet
            )






export default router2;