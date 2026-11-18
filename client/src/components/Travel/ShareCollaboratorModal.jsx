import { useState, useEffect } from "react";
import { X, Share2, Copy, Check, Users, Mail, Shield, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function ShareCollaboratorModal({ isOpen, onClose, tripId, tripTitle }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const shareUrl = `${window.location.origin}/trip/${tripId || ""}`;

  useEffect(() => {
    if (isOpen && tripId && tripId.length > 10) {
      api.get(`/trips/${tripId}/members`)
        .then((res) => {
          if (res.data?.success) setMembers(res.data.members || []);
        })
        .catch(() => {});
    }
  }, [isOpen, tripId]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    toast.success("Public share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/trips/${tripId}/members`, {
        email: email.trim(),
        role,
      });

      if (res.data?.success) {
        toast.success(`Invited ${email} as ${role}!`);
        if (res.data.member) {
          setMembers((prev) => [res.data.member, ...prev]);
        }
        setEmail("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to invite collaborator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Share & Collaborate
              </h3>
              <p className="text-xs text-slate-500">
                Invite friends to view or edit this travel itinerary
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Public Link Share Box */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              1. Direct Shareable Link
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pl-3">
              <span className="text-xs text-slate-600 truncate flex-1 font-mono">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Invite Collaborator Form */}
          {tripId && tripId.length > 10 && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                2. Invite Collaborator by Email
              </label>
              <form onSubmit={handleInvite} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white outline-none"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>Invite</span>
                </button>
              </form>
            </div>
          )}

          {/* Active Trip Members List */}
          {members.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Trip Members ({members.length})
              </label>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {m.user?.name ? m.user.name[0].toUpperCase() : "U"}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {m.user?.name || m.user?.email}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
