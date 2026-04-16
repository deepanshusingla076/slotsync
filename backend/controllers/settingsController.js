// controllers/settingsController.js
const settingsModel = require('../models/settingsModel');

const getSettings = async (req, res) => {
  try {
    const settings = await settingsModel.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { timezone } = req.body;
    if (!timezone) return res.status(400).json({ error: 'timezone is required' });
    const updated = await settingsModel.updateSettings({ timezone });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

module.exports = { getSettings, updateSettings };
