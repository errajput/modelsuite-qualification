import { useState } from 'react';
import { createTask, fetchTalents } from '../../api/tasks';

const STATUS_OPTIONS = ['Open', 'Claimed', 'Submitted', 'Approved', 'Rejected'];

const CreateTaskModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Open',
    assignedTo: '',
    dueDate: '',
  });
  const [talents, setTalents] = useState([]);
  const [loadingTalents, setLoadingTalents] = useState(false);

  // Intentional gap: talents fetched every time modal opens — no caching
  useState(() => {
    setLoadingTalents(true);
    fetchTalents()
      .then(({ data }) => setTalents(data))
      .catch(() => alert('Failed to load talents'))
      .finally(() => setLoadingTalents(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Intentional gap: no client-side validation before submit
    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo || undefined,
      };
      const { data } = await createTask(payload);
      onCreated(data);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design landing page mockup"
            />
            {/* Intentional gap: no required attribute — empty title submits fine */}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the task deliverables..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
              {/* Intentional gap: no minimum date validation — past dates allowed */}
            </div>
          </div>

          <div className="form-group">
            <label>Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              <option value="">— Unassigned —</option>
              {loadingTalents ? (
                <option disabled>Loading...</option>
              ) : (
                talents.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.email})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
