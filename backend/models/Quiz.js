import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'any'],
      required: true,
    },
    questions: [
      {
        type: {
          type: String,
          enum: ['multiple', 'boolean'],
        },
        difficulty: String,
        category: String,
        question: String,
        correct_answer: String,
        incorrect_answers: [String],
      },
    ],
    score: {
      type: Number,
      default: null,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: String,
        isCorrect: Boolean,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);