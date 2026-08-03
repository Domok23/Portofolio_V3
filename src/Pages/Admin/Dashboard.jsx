import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc, getDocs, doc, getDoc } from "../../firebase";
import { deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { LogOut, FolderPlus, Award, Boxes, User, Trash2, Plus, Edit3 } from "lucide-react";

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  // State
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [profileInfo, setProfileInfo] = useState({
    expYears: 3,
    projectsCompleted: 68,
    bio: "",
    cvUrl: "",
  });

  // Modal / Form state for Projects
  const [newProject, setNewProject] = useState({
    Title: "",
    Description: "",
    Img: "",
    Link: "",
    TechStack: "",
    Features: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Projects
      const projSnap = await getDocs(collection(db, "projects"));
      setProjects(projSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Certificates
      const certSnap = await getDocs(collection(db, "certificates"));
      setCertificates(certSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Profile info
      const profRef = doc(db, "profile-info", "main");
      const profSnap = await getDoc(profRef);
      if (profSnap.exists()) {
        setProfileInfo(profSnap.data());
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const techArray = newProject.TechStack.split(",").map((s) => s.trim()).filter(Boolean);
      const featArray = newProject.Features.split(",").map((s) => s.trim()).filter(Boolean);

      await addDoc(collection(db, "projects"), {
        ...newProject,
        TechStack: techArray,
        Features: featArray,
        createdAt: new Date(),
      });

      Swal.fire("Success", "Project added successfully", "success");
      setNewProject({ Title: "", Description: "", Img: "", Link: "", TechStack: "", Features: "" });
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDeleteProject = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "projects", id));
      Swal.fire("Deleted", "Project removed", "success");
      fetchData();
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "profile-info", "main"), profileInfo);
      Swal.fire("Saved", "Profile & stats updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
            Admin Control Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">Logged in as: {currentUser?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-2.5 rounded-xl border border-red-500/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Tabs Nav */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "projects" ? "bg-[#6366f1] text-white" : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          <FolderPlus className="w-5 h-5" /> Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "certificates" ? "bg-[#6366f1] text-white" : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          <Award className="w-5 h-5" /> Certificates ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "profile" ? "bg-[#6366f1] text-white" : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          <User className="w-5 h-5" /> Profile & Stats
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Add */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#6366f1]" /> Add New Project
            </h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.Title}
                onChange={(e) => setNewProject({ ...newProject, Title: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <textarea
                placeholder="Description"
                value={newProject.Description}
                onChange={(e) => setNewProject({ ...newProject, Description: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none h-24"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProject.Img}
                onChange={(e) => setNewProject({ ...newProject, Img: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Project/Demo Link"
                value={newProject.Link}
                onChange={(e) => setNewProject({ ...newProject, Link: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tech Stack (comma separated: React, Tailwind)"
                value={newProject.TechStack}
                onChange={(e) => setNewProject({ ...newProject, TechStack: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                Save Project
              </button>
            </form>
          </div>

          {/* Project List */}
          <div className="lg:col-span-2 space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{p.Title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{p.Description}</p>
                </div>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2.5 rounded-xl border border-red-500/30 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#6366f1]" /> Update Profile & Statistics
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Completed Projects Count</label>
              <input
                type="number"
                value={profileInfo.projectsCompleted}
                onChange={(e) => setProfileInfo({ ...profileInfo, projectsCompleted: Number(e.target.value) })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
              <input
                type="number"
                value={profileInfo.expYears}
                onChange={(e) => setProfileInfo({ ...profileInfo, expYears: Number(e.target.value) })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
