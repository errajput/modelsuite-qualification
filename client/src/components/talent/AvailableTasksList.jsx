import TaskCard from './TaskCard';

// Displays the grid of Open tasks the talent can claim
const AvailableTasksList = ({ tasks, onClaimed }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-card">
        🎉 No open tasks right now — check back later!
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          showClaimButton={true}
          onClaimed={onClaimed}
        />
      ))}
    </div>
  );
};

export default AvailableTasksList;
