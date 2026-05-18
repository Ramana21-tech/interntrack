import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  Users, Trash2, PlusCircle, FileText,
  Clock, Building, ChevronDown, ChevronUp, ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { currentUser, loginTime, internList, addIntern, removeIntern, allLogs } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedIntern, setExpandedIntern] = useState(null);
  const [newIntern, setNewIntern] = useState({
    name: "", email: "", password: "", department: "",
  });
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sorting states
  const [internSortBy, setInternSortBy] = useState("name"); // name | department | joinDate
  const [logSortBy, setLogSortBy] = useState("newest"); // newest | oldest | department

  const handleAddIntern = () => {
    if (!newIntern.name || !newIntern.email || !newIntern.password || !newIntern.department) {
      setFormError("All fields are required.");
      return;
    }
    addIntern(newIntern);
    setNewIntern({ name: "", email: "", password: "", department: "" });
    setFormError("");
    setSuccessMsg("Intern added successfully!");
    setShowAddForm(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this intern?")) {
      removeIntern(id);
    }
  };

  const getInternLogs = (internId) =>
    allLogs.filter((log) => log.internId === internId);

  // Sorted interns
  const sortedInterns = [...internList].sort((a, b) => {
    if (internSortBy === "department") return a.department.localeCompare(b.department);
    if (internSortBy === "joinDate") return new Date(b.joinDate) - new Date(a.joinDate);
    return a.name.localeCompare(b.name);
  });

  // Sorted logs
  const sortedLogs = [...allLogs].sort((a, b) => {
    if (logSortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (logSortBy === "department") {
      const deptA = internList.find((u) => u.id === a.internId)?.department || "";
      const deptB = internList.find((u) => u.id === b.internId)?.department || "";
      return deptA.localeCompare(deptB);
    }
    return new Date(b.date) - new Date(a.date); // newest default
  });

  // Unique departments for filter
  const departments = ["All", ...new Set(internList.map((i) => i.department))];
  const [filterDept, setFilterDept] = useState("All");

  const filteredInterns = filterDept === "All"
    ? sortedInterns
    : sortedInterns.filter((i) => i.department === filterDept);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="bg-blue-700 text-white rounded-2xl p-6 mb-6 shadow">
          <h2 className="text-2xl font-bold">Admin Panel 🛠️</h2>
          <p className="text-blue-200 mt-1">
            Welcome, {currentUser?.name} · {format(new Date(), "EEEE, dd MMM yyyy")}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm bg-blue-800 w-fit px-4 py-2 rounded-xl">
            <Clock size={16} />
            Session started at:{" "}
            <span className="font-semibold">
              {loginTime ? format(loginTime, "hh:mm:ss a") : "N/A"}
            </span>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            ✅ {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["overview", "interns", "logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users size={24} className="text-blue-700" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{internList.length}</p>
                <p className="text-sm text-gray-500">Total Interns</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Building size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {[...new Set(internList.map((i) => i.department))].length}
                </p>
                <p className="text-sm text-gray-500">Departments</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FileText size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{allLogs.length}</p>
                <p className="text-sm text-gray-500">Work Logs Submitted</p>
              </div>
            </div>
          </div>
        )}

        {/* INTERNS TAB */}
        {activeTab === "interns" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Users size={20} className="text-blue-600" /> All Interns
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                <PlusCircle size={16} />
                {showAddForm ? "Cancel" : "Add Intern"}
              </button>
            </div>

            {/* Sort + Filter Bar */}
            <div className="flex flex-wrap gap-3 mb-5 bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={15} className="text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
              </div>
              {[
                { label: "Name", value: "name" },
                { label: "Department", value: "department" },
                { label: "Join Date", value: "joinDate" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInternSortBy(opt.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    internSortBy === opt.value
                      ? "bg-blue-700 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <Building size={15} className="text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">Filter:</span>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Intern Form */}
            {showAddForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
                <h4 className="font-semibold text-blue-700 mb-3">New Intern Details</h4>
                {formError && (
                  <p className="text-red-500 text-sm mb-2">{formError}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={newIntern.name}
                    onChange={(e) => setNewIntern({ ...newIntern, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={newIntern.email}
                    onChange={(e) => setNewIntern({ ...newIntern, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={newIntern.password}
                    onChange={(e) => setNewIntern({ ...newIntern, password: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={newIntern.department}
                    onChange={(e) => setNewIntern({ ...newIntern, department: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleAddIntern}
                  className="mt-3 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                >
                  ➕ Add Intern
                </button>
              </div>
            )}

            {/* Interns List */}
            {filteredInterns.length === 0 ? (
              <p className="text-gray-400 text-sm">No interns found.</p>
            ) : (
              <div className="space-y-3">
                {filteredInterns.map((intern, index) => (
                  <div key={intern.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{index + 1}. {intern.name}</p>
                        <p className="text-sm text-gray-500">{intern.email}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {intern.department}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            Joined: {intern.joinDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setExpandedIntern(expandedIntern === intern.id ? null : intern.id)
                          }
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          {expandedIntern === intern.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          Logs
                        </button>
                        <button
                          onClick={() => handleRemove(intern.id)}
                          className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Intern Logs Dropdown */}
                    {expandedIntern === intern.id && (
                      <div className="mt-3 border-t pt-3">
                        {getInternLogs(intern.id).length === 0 ? (
                          <p className="text-gray-400 text-xs">No logs submitted yet.</p>
                        ) : (
                          getInternLogs(intern.id).map((log, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2 text-sm">
                              <div className="flex justify-between text-gray-500 text-xs mb-1">
                                <span>📅 {log.date}</span>
                                <span>In: {log.clockIn} · Out: {log.clockOut}</span>
                              </div>
                              <p className="text-gray-700">{log.work}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" /> All Work Logs
              </h3>
            </div>

            {/* Log Sort Bar */}
            <div className="flex flex-wrap gap-3 mb-5 bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={15} className="text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
              </div>
              {[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Department", value: "department" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLogSortBy(opt.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    logSortBy === opt.value
                      ? "bg-blue-700 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {sortedLogs.length === 0 ? (
              <p className="text-gray-400 text-sm">No logs submitted by any intern yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedLogs.map((log, i) => {
                  const intern = internList.find((u) => u.id === log.internId);
                  return (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-700">
                            {intern?.name || "Unknown Intern"}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            {intern?.department || "N/A"}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">📅 {log.date}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        🟢 In: {log.clockIn} · 🔴 Out: {log.clockOut}
                      </div>
                      <p className="text-gray-700">{log.work}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;