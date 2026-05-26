const mongoose = require('mongoose');

// Intentional gap: no unique constraint on { taskId, talentId } — a talent can submit
//   multiple times for the same task (no duplicate prevention)
// Intentional gap: no validation that fileUrl is a valid URL
// Intentional gap: no status field on Submission — can't distinguish pending/reviewed
const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      // Intentional gap: required is missing
    },
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Intentional gap: required is missing
    },
    fileUrl: {
      // Intentional gap: plain string — no URL format validation
      type: String,
    },
    notes: {
      type: String,
    },
    // Intentional gap: no reviewedBy field — no audit trail of who reviewed
    // Intentional gap: no reviewedAt timestamp — can't tell when review happened
    // Intentional gap: no enum validation on reviewStatus — any string is accepted
    reviewStatus: {
      type: String,
      default: 'Pending',
      // Should be: enum: ['Pending', 'Approved', 'Rejected']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
