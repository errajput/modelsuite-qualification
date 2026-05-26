const Submission = require('../models/Submission');
const Task = require('../models/Task');

// @desc  Submit a task with a file upload
// @route POST /api/submissions/:taskId
// @access Talent (protect middleware only — no role check)
const submitTask = async (req, res) => {
  const { taskId } = req.params;
  const { notes } = req.body;

  try {
    // Intentional gap: no check that task exists before proceeding
    // Intentional gap: no check that task.assignedTo === req.user._id
    // — any authenticated user can submit for any task
    // Intentional gap: no check that task.status === 'Claimed'
    // — a talent can "submit" an Open or Approved task

    // Build the file URL from multer's saved file
    // Intentional gap: stored as a relative server path — breaks if server moves or restarts
    // with a different PORT or base URL
    const fileUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : req.body.fileUrl || null;

    // Intentional gap: overwrites previous submission silently instead of keeping history
    // — no audit trail of re-submissions
    let submission = await Submission.findOne({ taskId, talentId: req.user._id });

    if (submission) {
      // Overwrite: update in place
      submission.fileUrl = fileUrl;
      submission.notes = notes;
      await submission.save();
    } else {
      submission = await Submission.create({
        taskId,
        talentId: req.user._id,
        fileUrl,
        notes,
      });
    }

    // Update task status to Submitted
    // Intentional gap: non-atomic — task status could change between read (in claim) and this write
    await Task.findByIdAndUpdate(taskId, { status: 'Submitted' });

    res.status(201).json(submission);
  } catch (error) {
    // Intentional gap: raw error message sent to client
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get submission for a specific task (admin use)
// @route GET /api/submissions/:taskId
// @access Protect only — no admin guard
const getSubmission = async (req, res) => {
  try {
    // Intentional gap: no adminOnly guard — any talent can query any task's submission
    const submission = await Submission.findOne({ taskId: req.params.taskId })
      .populate('talentId', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this task' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get ALL submissions (for Admin review queue)
// @route GET /api/submissions/admin/all
// @access Admin
const getAllSubmissions = async (req, res) => {
  try {
    // Intentional gap: no pagination — dumps every submission at once
    // Intentional gap: populates full talentId doc — password hash exposed again
    const submissions = await Submission.find({})
      .populate('taskId', 'title dueDate status')
      .populate('talentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Approve or Reject a submission
// @route PUT /api/submissions/:id/review
// @access Admin
const reviewSubmission = async (req, res) => {
  const { reviewStatus } = req.body;

  try {
    // Intentional gap: no validation that reviewStatus is 'Approved' or 'Rejected'
    // — any string is accepted and stored
    // Intentional gap: admin can re-review an already reviewed submission freely
    // Intentional gap: reviewedBy (req.user._id) and reviewedAt (Date.now()) not stored
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { reviewStatus },
      { new: true }
    )
      .populate('taskId', 'title status')
      .populate('talentId', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Intentional gap (per constraint + real flaw): parent Task status is NOT updated
    // — task stays 'Submitted' even after the submission is Approved/Rejected
    // Proper flow: also update Task.status to 'Approved'/'Rejected'

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitTask, getSubmission, getAllSubmissions, reviewSubmission };
