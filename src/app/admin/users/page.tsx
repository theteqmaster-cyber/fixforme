import UsersManager from '@/components/admin/UsersManager';

export default function AdminUsersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Identity & Access</h1>
        <p className="text-slate-400 mt-1">Manage platform users, roles, and access credentials.</p>
      </div>
      
      <UsersManager />
    </div>
  );
}
