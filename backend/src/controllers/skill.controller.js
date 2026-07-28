// src/controllers/skill.controller.js
// Full CRUD for Skill listings, plus browse/search/filter. Also keeps
// the denormalized User.skillsCanTeach / skillsWantToLearn tag arrays
// in sync whenever a skill is created, updated, or deleted, so the
// matching engine (which reads those arrays) always stays accurate.

import Skill from '../models/Skill.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';

const USER_FIELD_FOR_TYPE = {
    teach: 'skillsCanTeach',
    learn: 'skillsWantToLearn',
};

/**
 * Recomputes a user's denormalized tag array for a given skill type by
 * unioning the tags of all their currently-active skills of that type.
 * Called after any create/update/delete that could change the tag set.
 */
const syncUserSkillTags = async (userId, type) => {
    const field = USER_FIELD_FOR_TYPE[type];
    const activeSkills = await Skill.find({ user: userId, type, isActive: true }).select('tags');

    const unionTags = [...new Set(activeSkills.flatMap((s) => s.tags))];

    await User.findByIdAndUpdate(userId, { [field]: unionTags });
};

/**
 * @route   POST /api/skills
 * @access  Private
 */
export const createSkill = asyncHandler(async (req, res) => {
    const { title, category, type, description, tags = [], level } = req.body;

    const skill = await Skill.create({
        user: req.user._id,
        title,
        category,
        type,
        description,
        tags,
        level,
    });

    await syncUserSkillTags(req.user._id, type);

    return new ApiResponse(201, skill, 'Skill created successfully').send(res);
});

/**
 * @route   GET /api/skills
 * @access  Public
 * Supports browsing, searching, and filtering via query params:
 *   ?type=teach|learn
 *   ?category=technology
 *   ?level=beginner
 *   ?search=guitar          (full-text search across title/description/tags)
 *   ?tags=guitar,music      (comma-separated tag match)
 *   ?user=<userId>
 *   ?page=1&limit=20
 */
export const getSkills = asyncHandler(async (req, res) => {
    const { type, category, level, search, tags, user, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (user) filter.user = user;
    if (tags) {
        filter.tags = { $in: tags.split(',').map((t) => t.trim().toLowerCase()) };
    }
    if (search) {
        filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = Skill.find(filter)
        .populate('user', 'name profilePicture location averageRating trustScore')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const [skills, total] = await Promise.all([query, Skill.countDocuments(filter)]);

    return new ApiResponse(
        200,
        {
            skills,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        },
        'Skills fetched successfully'
    ).send(res);
});

/**
 * @route   GET /api/skills/:id
 * @access  Public
 */
export const getSkillById = asyncHandler(async (req, res) => {
    const skill = await Skill.findOne({ _id: req.params.id, isActive: true }).populate(
        'user',
        'name profilePicture location averageRating trustScore bio'
    );

    if (!skill) {
        throw ApiError.notFound('Skill not found.');
    }

    return new ApiResponse(200, skill, 'Skill fetched successfully').send(res);
});

/**
 * @route   PUT /api/skills/:id
 * @access  Private (owner only)
 */
export const updateSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        throw ApiError.notFound('Skill not found.');
    }

    if (skill.user.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('You can only edit your own skills.');
    }

    const ALLOWED_FIELDS = ['title', 'category', 'description', 'tags', 'level', 'isActive'];
    ALLOWED_FIELDS.forEach((field) => {
        if (req.body[field] !== undefined) {
            skill[field] = req.body[field];
        }
    });

    await skill.save();
    await syncUserSkillTags(skill.user, skill.type);

    return new ApiResponse(200, skill, 'Skill updated successfully').send(res);
});

/**
 * @route   DELETE /api/skills/:id
 * @access  Private (owner only)
 */
export const deleteSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        throw ApiError.notFound('Skill not found.');
    }

    if (skill.user.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('You can only delete your own skills.');
    }

    const { user: ownerId, type } = skill;
    await skill.deleteOne();
    await syncUserSkillTags(ownerId, type);

    return new ApiResponse(200, null, 'Skill deleted successfully').send(res);
});

export default { createSkill, getSkills, getSkillById, updateSkill, deleteSkill };