import { useState } from 'react';
import { updateTask, fetchTalents } from '../../api/tasks';

const STATUS_OPTIONS = ['Open', 'Claimed', 'Submitted', 'Approved', 'Rejected'];

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'Open',
    assignedTo: task.assignedTo?._id || '',
    dueDate: task.dueDate || '',
  });
  const [talents, setTalents] = useState([]);

  useState(() => {
    fetchTalents()
      .then(({ data }) => setTalents(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Intentional gap: no client-side validation
    try {
      const payload = { ...form, assignedTo: form.assignedTo || null };
      const { data } = await updateTask(task._id, payload);
      onUpdated(data);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              <option value="">— Unassigned —</option>
              {talents.map((t) => (
                <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
