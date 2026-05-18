import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Clock, CheckCircle, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

const InternDashboard = () => {
  const { currentUser, addLog } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [workLog, setWorkLog] = useState("");
  const [logs, setLogs] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setClockedIn(true);
    setClockOutTime(null);
    setSubmitted(false);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setClockedIn(false);
  };

  const handleSubmitLog = () => {
    if (!workLog.trim()) return;
    const newLog = {
      internId: currentUser.id,
      date: format(new Date(), "dd MMM yyyy"),
      clockIn: clockInTime ? format(clockInTime, "hh:mm a") : "N/A",
      clockOut: clockOutTime ? format(clockOutTime, "hh:mm a") : "N/A",
      work: workLog,
    };
    addLog(newLog);
    setLogs([newLog, ...logs]);
    setWorkLog("");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">

        {/* Welcome */}
        <div className="bg-blue-700 text-white rounded-2xl p-6 mb-6 shadow">
          <h2 className="text-2xl font-bold">Welcome, {currentUser?.name} 👋</h2>
          <p className="text-blue-200 mt-1">
            {currentUser?.department} · {format(new Date(), "EEEE, dd MMM yyyy")}
          </p>
        </div>

        {/* Clock In/Out */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" /> Attendance
          </h3>
          <div className="flex gap-4">
            <button
              onClick={handleClockIn}
              disabled={clockedIn}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition"
            >
              ✅ Clock In
            </button>
            <button
              onClick={handleClockOut}
              disabled={!clockedIn}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition"
            >
              🔴 Clock Out
            </button>
          </div>
          <div className="mt-4 flex gap-6 text-sm text-gray-600">
            <p>🟢 Clock In: <span className="font-medium">
              {clockInTime ? format(clockInTime, "hh:mm a") : "Not yet"}
            </span></p>
            <p>🔴 Clock Out: <span className="font-medium">
              {clockOutTime ? format(clockOutTime, "hh:mm a") : "Not yet"}
            </span></p>
          </div>
        </div>

        {/* Work Log */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" /> Daily Work Log
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none resize-none h-28"
            placeholder="Describe what you worked on today..."
            value={workLog}
            onChange={(e) => setWorkLog(e.target.value)}
          />
          <button
            onClick={handleSubmitLog}
            className="mt-3 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
          >
            Submit Log
          </button>
          {submitted && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <CheckCircle size={16} /> Log submitted successfully!
            </p>
          )}
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" /> Attendance History
          </h3>
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm">No logs submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 text-sm">
                  <div className="flex justify-between text-gray-500 mb-1">
                    <span>📅 {log.date}</span>
                    <span>In: {log.clockIn} · Out: {log.clockOut}</span>
                  </div>
                  <p className="text-gray-700">{log.work}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InternDashboard;