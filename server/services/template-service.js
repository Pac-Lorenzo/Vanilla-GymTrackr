const Template = require('../models/Template');

async function getGlobalTemplates() {
  return await Template.find({ is_global: true }).sort({ name: 1 });
}

async function getTemplateLibrary(userId) {
  const globalTemplates = await Template.find({ is_global: true }).sort({ name: 1 });
  const userTemplates = await Template.find({
    user_id: userId,
    is_global: false
  }).sort({ name: 1 });

  return {
    global: globalTemplates,
    custom: userTemplates,
    combined: [
      ...globalTemplates.map(t => ({ ...t.toObject(), source: 'global' })),
      ...userTemplates.map(t => ({ ...t.toObject(), source: 'user' }))
    ]
  };
}

async function createTemplate(data) {
  const templateData = {
    name: data.name,
    exercises: data.exercises || [],
    is_global: data.is_global || false
  };

  if (!templateData.is_global) {
    if (!data.user_id) {
      const err = new Error('user_id required for user templates');
      err.status = 400;
      throw err;
    }
    templateData.user_id = data.user_id;
  }

  return await Template.create(templateData);
}

async function getTemplateById(id) {
  return await Template.findById(id);
}

async function getUserTemplates(userId) {
  return await Template.find({
    user_id: userId,
    is_global: false
  }).sort({ name: 1 });
}

async function updateUserTemplate(userId, templateId, data) {
  const template = await Template.findById(templateId);
  if (!template || template.is_global || String(template.user_id) !== String(userId)) {
    return null;
  }

  if (data.name !== undefined) template.name = data.name;
  if (data.exercises !== undefined) template.exercises = data.exercises;

  await template.save();
  return template;
}

async function deleteTemplate(id) {
  return await Template.findByIdAndDelete(id);
}

module.exports = {
  getGlobalTemplates,
  getTemplateLibrary,
  createTemplate,
  getTemplateById,
  getUserTemplates,
  updateUserTemplate,
  deleteTemplate
};


