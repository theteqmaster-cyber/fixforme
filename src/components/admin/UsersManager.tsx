"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Users, Search, Ban, CheckCircle, Shield, Loader2, MoreVertical } from 'lucide-react';

export default function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'profiles'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    // In a real app, you'd trigger a Firebase Cloud Function to disable the auth user
    // Here we just update a theoretical 'status' field in the profile
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        status: newStatus
      });
      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status.");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">User Directory</h2>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/30 text-slate-400 text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Rating</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No users found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex flex-shrink-0 items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold">{user.full_name?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-tight">{user.full_name}</p>
                        <p className="text-slate-500 text-xs font-mono">{user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      user.role === 'client' ? 'bg-accent/10 text-accent border-accent/20' :
                      'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold text-sm">{user.rating || 'N/A'}</span>
                      {user.rating && <span className="text-yellow-500 text-xs">★</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      user.status === 'suspended' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {user.status === 'suspended' ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {user.status === 'suspended' ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleUserStatus(user.id, user.status)}
                      disabled={user.role === 'admin'}
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors ${
                        user.status === 'suspended' 
                          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {user.status === 'suspended' ? 'Restore' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
