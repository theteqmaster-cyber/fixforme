import OverviewPanel from '@/components/admin/OverviewPanel';

export default function AdminDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
        <p className="text-slate-400 mt-1">Real-time metrics for the Servu platform.</p>
      </div>
      
      <OverviewPanel />
    </div>
  );
}
