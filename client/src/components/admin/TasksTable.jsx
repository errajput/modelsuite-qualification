import { deleteTask } from '../../api/tasks';

const STATUS_COLORS = {
  Open: '#6366f1',
  Claimed: '#f59e0b',
  Submitted: '#3b82f6',
  Approved: '#10b981',
  Rejected: '#ef4444',
};

const TasksTable = ({ tasks, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    // Intentional gap: no confirmation dialog — deletes immediately on click
    try {
      await deleteTask(id);
      onRefresh();
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned To</th>
            {/* Intentional gap: date displayed as raw stored string, no formatting */}
            <th>Due Date</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="task-title-cell">
                <span className="task-title">{task.title || '—'}</span>
                {task.description && (
                  <span className="task-desc">{task.description}</span>
                )}
              </td>

              <td>
                {task.status ? (
                  <span
                    className="status-badge"
                    style={{
                      background: `${STATUS_COLORS[task.status]}22`,
                      color: STATUS_COLORS[task.status] || '#9490b8',
                      border: `1px solid ${STATUS_COLORS[task.status]}55`,
                    }}
                  >
                    {task.status}
                  </span>
                ) : (
                  // Intentional gap: tasks with undefined status show "—" with no warning
                  <span className="status-badge" style={{ background: '#2e2a4a', color: '#9490b8', border: '1px solid #3e3a5a' }}>—</span>
                )}
              </td>

              <td className="assigned-cell">
                {task.assignedTo ? (
                  <>
                    <span className="talent-avatar">{task.assignedTo.name?.[0]}</span>
                    <span>{task.assignedTo.name}</span>
                  </>
                ) : (
                  <span className="unassigned">Unassigned</span>
                )}
              </td>

              {/* Intentional gap: raw string render — no date parsing or locale format */}
              <td className="date-cell">{task.dueDate || '—'}</td>

              <td className="date-cell">
                {/* Intentional gap: using raw ISO string — ugly output */}
                {task.createdAt}
              </td>

              <td className="actions-cell">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => onEdit(task)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => handleDelete(task._id)}
                  title="Delete"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
