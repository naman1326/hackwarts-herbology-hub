// src/routes/skill.routes.js

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as skillController from '../controllers/skill.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { SKILL_CATEGORY_VALUES } from '../models/Skill.js';

const router = Router();

const createSkillValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category')
        .isIn(SKILL_CATEGORY_VALUES)
        .withMessage(`Category must be one of: ${SKILL_CATEGORY_VALUES.join(', ')}`),
    body('type').isIn(['teach', 'learn']).withMessage('Type must be "teach" or "learn"'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be beginner, intermediate, or advanced'),
];

const updateSkillValidation = [
    param('id').isMongoId().withMessage('Invalid skill id'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('category')
        .optional()
        .isIn(SKILL_CATEGORY_VALUES)
        .withMessage(`Category must be one of: ${SKILL_CATEGORY_VALUES.join(', ')}`),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be beginner, intermediate, or advanced'),
];

const listSkillsValidation = [
    query('type').optional().isIn(['teach', 'learn']),
    query('category').optional().isIn(SKILL_CATEGORY_VALUES),
    query('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
];

router.get('/', listSkillsValidation, validate, skillController.getSkills);
router.post('/', protect, createSkillValidation, validate, skillController.createSkill);
router.get(
    '/:id',
    [param('id').isMongoId().withMessage('Invalid skill id')],
    validate,
    skillController.getSkillById
);
router.put('/:id', protect, updateSkillValidation, validate, skillController.updateSkill);
router.delete(
    '/:id',
    protect,
    [param('id').isMongoId().withMessage('Invalid skill id')],
    validate,
    skillController.deleteSkill
);

export default router;