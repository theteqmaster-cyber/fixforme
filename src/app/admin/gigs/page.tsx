import GigsManager from '@/components/admin/GigsManager';

export default function AdminGigsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Marketplace Operations</h1>
        <p className="text-slate-400 mt-1">Override task statuses and moderate the gig economy.</p>
      </div>
      
      <GigsManager />
    </div>
  );
}
