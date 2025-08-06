import * as firestoreService from '../services/firestoreService.js';

// Validation helper
const validateQuestion = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!data.desc || data.desc.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!data.solutions || typeof data.solutions !== 'object') {
    errors.push('Solutions object is required');
  } else {
    if (!data.solutions.global || data.solutions.global.trim().length === 0) {
      errors.push('Global solution is required');
    }
    if (!data.solutions.function || data.solutions.function.trim().length === 0) {
      errors.push('Function solution is required');
    }
    if (!data.solutions.args || data.solutions.args.trim().length === 0) {
      errors.push('Arguments solution is required');
    }
  }
  
  return errors;
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await firestoreService.getAllQuestions();
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await firestoreService.getQuestionById(id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question',
      error: error.message
    });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const validation = validateQuestion(req.body);
    if (validation.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation
      });
    }
    
    const questionData = {
      title: req.body.title.trim(),
      desc: req.body.desc.trim(),
      solutions: {
        global: req.body.solutions.global.trim(),
        function: req.body.solutions.function.trim(),
        args: req.body.solutions.args.trim()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const questionId = await firestoreService.addQuestion(questionData);
    
    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: { id: questionId, ...questionData }
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add question',
      error: error.message
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateQuestion(req.body);
    
    if (validation.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation
      });
    }
    
    const questionData = {
      title: req.body.title.trim(),
      desc: req.body.desc.trim(),
      solutions: {
        global: req.body.solutions.global.trim(),
        function: req.body.solutions.function.trim(),
        args: req.body.solutions.args.trim()
      },
      updatedAt: new Date().toISOString()
    };
    
    const updated = await firestoreService.updateQuestion(id, questionData);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Question updated successfully',
      data: { id, ...questionData }
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await firestoreService.deleteQuestion(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};