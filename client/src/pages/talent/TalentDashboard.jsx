import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';

const TalentDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks]               = useState([]);
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { setError('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { setError('Failed to load your tasks'); }
  };
  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);
  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  return (
    <div className="flex min-h-screen bg-bg-dark">
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-10 py-9">

        {/* Header */}
        <div className="mb-8">
          
          <h1 className="text-[24px] font-bold tracking-tight text-text-primary">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-text-muted">Browse available tasks below and claim one to get started.</p>
        </div>

        
        {error && (
          <p className="text-danger text-sm mb-4">{error}</p>
        )}

        {/* Available Tasks */}
        <section className="mb-9">
          <h2 className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.8px] text-text-muted mb-4">
            Available Tasks
            <span className="bg-bg-input border border-border text-text-faint text-[11px] px-2 py-0.5 rounded-full">
              {availableTasks.length}
            </span>
          </h2>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleRefresh} />
        </section>

        {/* My Tasks */}
        <section className="mb-9">
          <h2 className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.8px] text-text-muted mb-4">
            My Tasks
            <span className="bg-bg-input border border-border text-text-faint text-[11px] px-2 py-0.5 rounded-full">
              {myTasks.length}
            </span>
          </h2>
          <MyTasksList tasks={myTasks} onRefresh={handleRefresh} />
        </section>
      </main>
    </div>
  );
};

export default TalentDashboard;
