import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc, getDocs, doc, getDoc } from "../../firebase";
import { deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { LogOut, FolderPlus, Award, User, Trash2, Plus, Edit3, Upload, Loader2, FileText, X, ExternalLink, Github, ChevronDown, ChevronUp, Star } from "lucide-react";

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  // State & Loading
  const DEFAULT_CV_URL = "https://drive.google.com/file/d/1OaHN3hVqncJR9-7HXDh2qLbWGYN6Nabp/view?usp=drive_link";

  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [profileInfo, setProfileInfo] = useState({
    expYears: 3,
    projectsCompleted: 68,
    bio: "",
    cvUrl: DEFAULT_CV_URL,
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  // Edit & Accordion state
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const toggleProjectExpand = (id) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  // Modal / Form state for Projects
  const [newProject, setNewProject] = useState({
    Title: "",
    Description: "",
    Img: "",
    Link: "",
    Github: "",
    TechStack: "",
    Features: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
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
        const data = profSnap.data();
        setProfileInfo((prev) => ({
          ...prev,
          ...data,
          cvUrl: data.cvUrl || DEFAULT_CV_URL,
        }));
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const [projectFile, setProjectFile] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToImgBB = async (file) => {
    if (!file) return { url: "", deleteUrl: "" };
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "bb7ea0ebda097a0211ae7d742d048858";
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data && data.success) {
      return {
        url: data.data.url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      throw new Error(data?.error?.message || "Failed to upload image to ImgBB");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imgUrl = newProject.Img;
      let deleteUrl = newProject.deleteUrl || "";

      if (projectFile) {
        const uploadRes = await uploadToImgBB(projectFile);
        imgUrl = uploadRes.url;
        deleteUrl = uploadRes.deleteUrl;
      }

      if (!imgUrl) {
        throw new Error("Please select an image file or enter an image URL.");
      }

      const techArray = typeof newProject.TechStack === "string" 
        ? newProject.TechStack.split(",").map((s) => s.trim()).filter(Boolean) 
        : (newProject.TechStack || []);
      const featArray = typeof newProject.Features === "string" 
        ? newProject.Features.split(",").map((s) => s.trim()).filter(Boolean) 
        : (newProject.Features || []);

      const projectData = {
        Title: newProject.Title,
        Description: newProject.Description,
        Img: imgUrl,
        Link: newProject.Link || "",
        Github: newProject.Github || "",
        deleteUrl: deleteUrl || "",
        TechStack: techArray,
        Features: featArray,
      };

      if (editingProjectId) {
        await updateDoc(doc(db, "projects", editingProjectId), projectData);
        Swal.fire("Saved", "Project updated successfully!", "success");
        setEditingProjectId(null);
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: new Date(),
        });
        Swal.fire("Saved", "Project added successfully!", "success");
      }

      setNewProject({ Title: "", Description: "", Img: "", Link: "", Github: "", TechStack: "", Features: "", deleteUrl: "" });
      setProjectFile(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartEditProject = (project) => {
    setEditingProjectId(project.id);
    setNewProject({
      Title: project.Title || "",
      Description: project.Description || "",
      Img: project.Img || "",
      Link: project.Link || "",
      Github: project.Github || "",
      TechStack: Array.isArray(project.TechStack) ? project.TechStack.join(", ") : (project.TechStack || ""),
      Features: Array.isArray(project.Features) ? project.Features.join(", ") : (project.Features || ""),
      deleteUrl: project.deleteUrl || "",
    });
    setProjectFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setNewProject({ Title: "", Description: "", Img: "", Link: "", Github: "", TechStack: "", Features: "", deleteUrl: "" });
    setProjectFile(null);
  };

  const handleDeleteProject = async (project) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "projects", project.id));
      fetchData();

      if (project.deleteUrl) {
        const deleteImg = await Swal.fire({
          title: "Delete Image from ImgBB?",
          text: "Project removed from database. Would you like to open the image deletion page on ImgBB?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Delete ImgBB Image",
          cancelButtonText: "Skip",
          confirmButtonColor: "#6366f1",
        });
        if (deleteImg.isConfirmed) {
          window.open(project.deleteUrl, "_blank");
        }
      } else {
        Swal.fire("Deleted", "Project removed from database", "success");
      }
    }
  };

  // Modal / Form state for Certificates
  const [newCertificate, setNewCertificate] = useState({
    Title: "",
    Issuer: "",
    ImgSertif: "",
    Date: "",
  });

  const handleSaveCertificate = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imgUrl = newCertificate.ImgSertif;
      let deleteUrl = newCertificate.deleteUrl || "";

      if (certFile) {
        const uploadRes = await uploadToImgBB(certFile);
        imgUrl = uploadRes.url;
        deleteUrl = uploadRes.deleteUrl;
      }

      if (!imgUrl) {
        throw new Error("Please select an image file or enter a certificate URL.");
      }

      const certData = {
        Title: newCertificate.Title,
        Issuer: newCertificate.Issuer,
        Img: imgUrl,
        ImgSertif: imgUrl,
        deleteUrl: deleteUrl || "",
        Date: newCertificate.Date || "",
      };

      if (editingCertId) {
        await updateDoc(doc(db, "certificates", editingCertId), certData);
        Swal.fire("Saved", "Certificate updated successfully!", "success");
        setEditingCertId(null);
      } else {
        await addDoc(collection(db, "certificates"), {
          ...certData,
          createdAt: new Date(),
        });
        Swal.fire("Saved", "Certificate added successfully!", "success");
      }

      setNewCertificate({ Title: "", Issuer: "", ImgSertif: "", Date: "", deleteUrl: "" });
      setCertFile(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartEditCertificate = (cert) => {
    setEditingCertId(cert.id);
    setNewCertificate({
      Title: cert.Title || cert.Name || cert.name || "",
      Issuer: cert.Issuer || "",
      ImgSertif: cert.Img || cert.ImgSertif || "",
      Date: cert.Date || "",
      deleteUrl: cert.deleteUrl || "",
    });
    setCertFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditCertificate = () => {
    setEditingCertId(null);
    setNewCertificate({ Title: "", Issuer: "", ImgSertif: "", Date: "", deleteUrl: "" });
    setCertFile(null);
  };

  const handleDeleteCertificate = async (cert) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This certificate will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "certificates", cert.id));
      fetchData();

      if (cert.deleteUrl) {
        const deleteImg = await Swal.fire({
          title: "Delete Image from ImgBB?",
          text: "Certificate removed from database. Would you like to open the image deletion page on ImgBB?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Delete ImgBB Image",
          cancelButtonText: "Skip",
          confirmButtonColor: "#6366f1",
        });
        if (deleteImg.isConfirmed) {
          window.open(cert.deleteUrl, "_blank");
        }
      } else {
        Swal.fire("Deleted", "Certificate removed from database", "success");
      }
    }
  };

  const [cvFile, setCvFile] = useState(null);

  const uploadPdfFile = async (file) => {
    if (!file) return "";
    
    // Jika file berupa gambar, gunakan ImgBB
    if (file.type.startsWith("image/")) {
      const res = await uploadToImgBB(file);
      return res.url;
    }

    // Jika file berupa PDF: gunakan tmpfiles.org API (CORS-enabled, gratis, tanpa kartu kredit)
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data && data.status === "success" && data.data?.url) {
      // Ubah URL halaman menjadi direct link berkas PDF
      return data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
    } else {
      throw new Error("Failed to upload PDF file. Please use Google Drive share link (Option A).");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let finalCvUrl = profileInfo.cvUrl || "";

      if (cvFile) {
        finalCvUrl = await uploadPdfFile(cvFile);
      }

      const updatedProfile = {
        ...profileInfo,
        cvUrl: finalCvUrl,
      };

      await setDoc(doc(db, "profile-info", "main"), updatedProfile);
      setProfileInfo(updatedProfile);
      setCvFile(null);
      Swal.fire("Saved", "Profile & CV updated successfully!", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsUploading(false);
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
          <FolderPlus className="w-5 h-5" /> Projects (
          {isLoadingData ? <Loader2 className="w-3.5 h-3.5 animate-spin inline text-indigo-200" /> : projects.length}
          )
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "certificates" ? "bg-[#6366f1] text-white" : "bg-white/5 hover:bg-white/10 text-gray-300"
          }`}
        >
          <Award className="w-5 h-5" /> Certificates (
          {isLoadingData ? <Loader2 className="w-3.5 h-3.5 animate-spin inline text-indigo-200" /> : certificates.length}
          )
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
          {/* Form Add / Edit Project */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {editingProjectId ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-[#6366f1]" />}
                {editingProjectId ? "Edit Project" : "Add New Project"}
              </h2>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={handleCancelEditProject}
                  className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1 bg-amber-500/20 rounded-xl border border-amber-500/30 font-medium transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Project Title <span className="text-red-400 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Platform"
                  value={newProject.Title}
                  onChange={(e) => setNewProject({ ...newProject, Title: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description <span className="text-red-400 font-bold">*</span>
                </label>
                <textarea
                  placeholder="Describe your project..."
                  value={newProject.Description}
                  onChange={(e) => setNewProject({ ...newProject, Description: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all h-24 text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">
                  Project Image <span className="text-red-400 font-bold">*</span> (Choose one option)
                </label>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className={newProject.Img ? "opacity-40" : ""}>
                    <span className="block text-xs text-[#6366f1] font-medium mb-1.5">
                      Option A: Upload File from Device (ImgBB) {newProject.Img && "(Disabled - URL filled)"}
                    </span>
                    {projectFile ? (
                      <div className="flex items-center justify-between p-2.5 bg-[#6366f1]/15 rounded-lg border border-[#6366f1]/40">
                        <div className="flex items-center gap-2 overflow-hidden text-xs text-white">
                          <FileText className="w-4 h-4 text-[#6366f1] shrink-0" />
                          <span className="truncate font-medium">{projectFile.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            ({(projectFile.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProjectFile(null)}
                          className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-white/10 transition-all shrink-0"
                          title="Cancel file selection"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!!newProject.Img}
                        onChange={(e) => setProjectFile(e.target.files[0] || null)}
                        className="w-full p-2 bg-white/10 rounded-lg text-xs border border-white/20 text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-[#6366f1] file:text-white file:text-xs cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:border-[#6366f1]"
                      />
                    )}
                  </div>

                  <div className={`pt-2 border-t border-white/10 ${projectFile ? "opacity-40" : ""}`}>
                    <span className="block text-xs text-gray-400 font-medium mb-1">
                      Option B: Paste Image Link / URL {projectFile && "(Disabled - File selected)"}
                    </span>
                    <input
                      type="text"
                      placeholder="https://... or /projects/image.png"
                      value={newProject.Img}
                      disabled={!!projectFile}
                      onChange={(e) => setNewProject({ ...newProject, Img: e.target.value })}
                      className="w-full p-2.5 bg-white/10 rounded-lg border border-white/20 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Live Demo Link</label>
                <input
                  type="text"
                  placeholder="https://myproject.com"
                  value={newProject.Link}
                  onChange={(e) => setNewProject({ ...newProject, Link: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">GitHub Repo Link</label>
                <input
                  type="text"
                  placeholder="https://github.com/... (or type 'Private')"
                  value={newProject.Github}
                  onChange={(e) => setNewProject({ ...newProject, Github: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Tech Stack</label>
                <input
                  type="text"
                  placeholder="Comma separated: React, Tailwind, Firebase"
                  value={newProject.TechStack}
                  onChange={(e) => setNewProject({ ...newProject, TechStack: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Key Features</label>
                <textarea
                  placeholder="Comma separated: Realtime Chat, Dark Mode"
                  value={newProject.Features}
                  onChange={(e) => setNewProject({ ...newProject, Features: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all h-20 text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading
                  ? "Saving..."
                  : editingProjectId
                  ? "Update Project"
                  : "Save Project"}
              </button>
            </form>
          </div>

          {/* Project List */}
          <div className="lg:col-span-2 space-y-4">
            {isLoadingData ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 animate-pulse flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-white/10 rounded-lg shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded w-1/3" />
                        <div className="h-3 bg-white/5 rounded w-2/3" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-20 h-8 bg-white/10 rounded-xl" />
                      <div className="w-14 h-8 bg-white/10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
                No projects found. Add your first project!
              </div>
            ) : (
              projects.map((p) => {
                const isExpanded = expandedProjectId === p.id;
                return (
                  <div key={p.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all">
                    {/* Accordion Header Bar */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div 
                        onClick={() => toggleProjectExpand(p.id)}
                        className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                      >
                        {p.Img && (
                          <img
                            src={p.Img}
                            alt={p.Title}
                            className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base text-white truncate">{p.Title}</h3>
                          <p className="text-gray-400 text-xs truncate">{p.Description}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleProjectExpand(p.id)}
                          className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-1 text-xs font-medium border border-white/10"
                          title={isExpanded ? "Hide Details" : "View Details"}
                        >
                          <span className="hidden sm:inline">{isExpanded ? "Collapse" : "View Details"}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleStartEditProject(p)}
                          className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded-xl border border-indigo-500/30 transition-all flex items-center gap-1 text-xs font-medium"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-xl border border-red-500/30 transition-all"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Accordion Content Drawer */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-white/10 bg-white/[0.02] space-y-3.5 text-xs text-gray-300">
                        <div>
                          <span className="text-gray-400 font-semibold block mb-1">Full Description:</span>
                          <p className="leading-relaxed text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">
                            {p.Description}
                          </p>
                        </div>

                        {/* Tech Stack Badges */}
                        {Array.isArray(p.TechStack) && p.TechStack.length > 0 && (
                          <div>
                            <span className="text-gray-400 font-semibold block mb-1">Technologies Used:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {p.TechStack.map((tech, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-[#6366f1]/20 text-[#818cf8] rounded-md font-medium border border-[#6366f1]/30">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Features */}
                        {Array.isArray(p.Features) && p.Features.length > 0 && (
                          <div>
                            <span className="text-gray-400 font-semibold block mb-1">Key Features:</span>
                            <ul className="list-disc list-inside space-y-1 text-gray-300 pl-1">
                              {p.Features.map((feat, idx) => (
                                <li key={idx}>{feat}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
                          {p.Link && (
                            <a 
                              href={p.Link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[#818cf8] hover:underline flex items-center gap-1.5 font-medium bg-[#6366f1]/10 px-3 py-1.5 rounded-lg border border-[#6366f1]/20"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Live Demo Link
                            </a>
                          )}
                          {p.Github && (
                            <a 
                              href={p.Github === "Private" ? "#" : p.Github} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-300 hover:text-white hover:underline flex items-center gap-1.5 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                            >
                              <Github className="w-3.5 h-3.5" /> {p.Github === "Private" ? "Private Repository" : "GitHub Repo"}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === "certificates" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Add / Edit Certificate */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {editingCertId ? <Edit3 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-[#6366f1]" />}
                {editingCertId ? "Edit Certificate" : "Add New Certificate"}
              </h2>
              {editingCertId && (
                <button
                  type="button"
                  onClick={handleCancelEditCertificate}
                  className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1 bg-amber-500/20 rounded-xl border border-amber-500/30 font-medium transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSaveCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Certificate Title <span className="text-red-400 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fullstack Web Developer"
                  value={newCertificate.Title}
                  onChange={(e) => setNewCertificate({ ...newCertificate, Title: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Issuer <span className="text-red-400 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dicoding, Coursera, Google"
                  value={newCertificate.Issuer}
                  onChange={(e) => setNewCertificate({ ...newCertificate, Issuer: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">
                  Certificate Image <span className="text-red-400 font-bold">*</span> (Choose one option)
                </label>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className={newCertificate.ImgSertif ? "opacity-40" : ""}>
                    <span className="block text-xs text-[#6366f1] font-medium mb-1.5">
                      Option A: Upload File from Device (ImgBB) {newCertificate.ImgSertif && "(Disabled - URL filled)"}
                    </span>
                    {certFile ? (
                      <div className="flex items-center justify-between p-2.5 bg-[#6366f1]/15 rounded-lg border border-[#6366f1]/40">
                        <div className="flex items-center gap-2 overflow-hidden text-xs text-white">
                          <FileText className="w-4 h-4 text-[#6366f1] shrink-0" />
                          <span className="truncate font-medium">{certFile.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            ({(certFile.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCertFile(null)}
                          className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-white/10 transition-all shrink-0"
                          title="Cancel file selection"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!!newCertificate.ImgSertif}
                        onChange={(e) => setCertFile(e.target.files[0] || null)}
                        className="w-full p-2 bg-white/10 rounded-lg text-xs border border-white/20 text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-[#6366f1] file:text-white file:text-xs cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:border-[#6366f1]"
                      />
                    )}
                  </div>

                  <div className={`pt-2 border-t border-white/10 ${certFile ? "opacity-40" : ""}`}>
                    <span className="block text-xs text-gray-400 font-medium mb-1">
                      Option B: Paste Image Link / URL {certFile && "(Disabled - File selected)"}
                    </span>
                    <input
                      type="text"
                      placeholder="https://... or /certificates/image.png"
                      value={newCertificate.ImgSertif}
                      disabled={!!certFile}
                      onChange={(e) => setNewCertificate({ ...newCertificate, ImgSertif: e.target.value })}
                      className="w-full p-2.5 bg-white/10 rounded-lg border border-white/20 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Issue Date</label>
                <input
                  type="text"
                  placeholder="e.g. Nov 2024"
                  value={newCertificate.Date}
                  onChange={(e) => setNewCertificate({ ...newCertificate, Date: e.target.value })}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading
                  ? "Saving..."
                  : editingCertId
                  ? "Update Certificate"
                  : "Save Certificate"}
              </button>
            </form>
          </div>

          {/* Certificate List */}
          <div className="lg:col-span-2 space-y-4">
            {isLoadingData ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 animate-pulse flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-16 h-12 bg-white/10 rounded-lg shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded w-1/3" />
                        <div className="h-3 bg-white/5 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-14 h-8 bg-white/10 rounded-xl" />
                      <div className="w-10 h-8 bg-white/10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : certificates.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
                No certificates found. Add your first certificate!
              </div>
            ) : (
              certificates.map((c, index) => {
                const imgUrl = c.Img || c.ImgSertif || "";
                let title = c.Title || c.Name || c.name;
                if (!title && imgUrl) {
                  const rawName = decodeURIComponent(imgUrl.split("/").pop() || "");
                  title = rawName.split("?")[0].replace(/\.[^/.]+$/, "");
                }
                return (
                  <div key={c.id || index} className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      {imgUrl && (
                        <a href={imgUrl} target="_blank" rel="noopener noreferrer" title="Click to view image" className="shrink-0">
                          <img
                            src={imgUrl}
                            alt="Certificate"
                            className="w-16 h-12 object-cover rounded-lg border border-white/10 hover:opacity-80 transition-all"
                          />
                        </a>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg text-white truncate">{title || `Certificate #${index + 1}`}</h3>
                        <p className="text-gray-400 text-xs truncate">
                          <span className="text-indigo-400 font-medium">{c.Issuer || "Personal Certificate"}</span>
                          {c.Date ? ` • ${c.Date}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleStartEditCertificate(c)}
                        className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded-xl border border-indigo-500/30 transition-all flex items-center gap-1.5 text-xs font-medium"
                        title="Edit Certificate"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(c)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-xl border border-red-500/30 transition-all"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Completed Projects Count <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                type="number"
                value={profileInfo.projectsCompleted}
                onChange={(e) => setProfileInfo({ ...profileInfo, projectsCompleted: Number(e.target.value) })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Years of Experience <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                type="number"
                value={profileInfo.expYears}
                onChange={(e) => setProfileInfo({ ...profileInfo, expYears: Number(e.target.value) })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/40 transition-all text-xs"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                CV Document <span className="text-red-400 font-bold">*</span> (Choose one option)
              </label>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <div className={cvFile ? "opacity-40" : ""}>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    Option A (Recommended): Google Drive Share Link / Online PDF URL {cvFile && "(Disabled - File selected)"}
                  </span>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/... (Upload to Drive & paste share link here)"
                    value={profileInfo.cvUrl || ""}
                    disabled={!!cvFile}
                    onChange={(e) => setProfileInfo({ ...profileInfo, cvUrl: e.target.value })}
                    className="w-full p-3 bg-white/10 rounded-lg border border-emerald-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all disabled:cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    *Opens official interactive PDF Viewer for portfolio visitors (scrollable, readable, and downloadable without expiration).
                  </p>
                </div>

                <div className={`pt-2 border-t border-white/10 ${profileInfo.cvUrl ? "opacity-40" : ""}`}>
                  <span className="block text-xs text-gray-400 font-medium mb-1.5">
                    Option B: Upload CV File from Device (.pdf / Image) {profileInfo.cvUrl && "(Disabled - Drive URL filled)"}
                  </span>
                  {cvFile ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#6366f1]/15 rounded-lg border border-[#6366f1]/40">
                      <div className="flex items-center gap-2 overflow-hidden text-xs text-white">
                        <FileText className="w-4 h-4 text-[#6366f1] shrink-0" />
                        <span className="truncate font-medium">{cvFile.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          ({(cvFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-white/10 transition-all shrink-0"
                        title="Cancel file selection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      disabled={!!profileInfo.cvUrl}
                      onChange={(e) => setCvFile(e.target.files[0] || null)}
                      className="w-full p-2 bg-white/10 rounded-lg text-xs border border-white/20 text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-[#6366f1] file:text-white file:text-xs cursor-pointer disabled:cursor-not-allowed"
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {isUploading ? "Uploading & Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
