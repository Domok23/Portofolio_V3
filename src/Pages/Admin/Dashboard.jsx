import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, storage, collection, addDoc, getDocs, doc, getDoc } from "../../firebase";
import { deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { LogOut, FolderPlus, Award, Boxes, User, Trash2, Plus, Edit3, Upload, Loader2, XCircle, FileText, X } from "lucide-react";

const Dashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  // State
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

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imgUrl = newProject.Img;
      let deleteUrl = "";

      if (projectFile) {
        const uploadRes = await uploadToImgBB(projectFile);
        imgUrl = uploadRes.url;
        deleteUrl = uploadRes.deleteUrl;
      }

      if (!imgUrl) {
        throw new Error("Pilih file gambar atau masukkan URL gambar.");
      }

      const techArray = newProject.TechStack.split(",").map((s) => s.trim()).filter(Boolean);
      const featArray = newProject.Features.split(",").map((s) => s.trim()).filter(Boolean);

      await addDoc(collection(db, "projects"), {
        ...newProject,
        Img: imgUrl,
        deleteUrl: deleteUrl || "",
        TechStack: techArray,
        Features: featArray,
        createdAt: new Date(),
      });

      Swal.fire("Success", "Project added successfully!", "success");
      setNewProject({ Title: "", Description: "", Img: "", Link: "", Github: "", TechStack: "", Features: "" });
      setProjectFile(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsUploading(false);
    }
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
          title: "Hapus Gambar dari ImgBB?",
          text: "Data proyek sudah terhapus dari database. Apakah kamu ingin membuka halaman penghapusan gambar di ImgBB?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Hapus Gambar di ImgBB",
          cancelButtonText: "Tidak Perlu",
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

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let imgUrl = newCertificate.ImgSertif;
      let deleteUrl = "";

      if (certFile) {
        const uploadRes = await uploadToImgBB(certFile);
        imgUrl = uploadRes.url;
        deleteUrl = uploadRes.deleteUrl;
      }

      if (!imgUrl) {
        throw new Error("Pilih file gambar atau masukkan URL sertifikat.");
      }

      await addDoc(collection(db, "certificates"), {
        Title: newCertificate.Title,
        Issuer: newCertificate.Issuer,
        Img: imgUrl,
        ImgSertif: imgUrl,
        deleteUrl: deleteUrl || "",
        Date: newCertificate.Date,
        createdAt: new Date(),
      });

      Swal.fire("Success", "Certificate added successfully!", "success");
      setNewCertificate({ Title: "", Issuer: "", ImgSertif: "", Date: "" });
      setCertFile(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsUploading(false);
    }
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
          title: "Hapus Gambar dari ImgBB?",
          text: "Sertifikat telah dihapus dari database. Apakah kamu ingin membuka halaman penghapusan gambar di ImgBB?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Hapus Gambar di ImgBB",
          cancelButtonText: "Tidak Perlu",
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
      throw new Error("Gagal mengunggah file PDF. Silakan gunakan link Google Drive (Cara B).");
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
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">Gambar Proyek (Gunakan salah satu cara)</label>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className={newProject.Img ? "opacity-40" : ""}>
                    <span className="block text-xs text-[#6366f1] font-medium mb-1.5">
                      Cara A: Upload File dari Device (ImgBB) {newProject.Img && "(Disabled - URL terisi)"}
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
                          title="Batal pilih file"
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
                        className="w-full p-2 bg-white/10 rounded-lg text-xs border border-white/20 text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-[#6366f1] file:text-white file:text-xs cursor-pointer disabled:cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div className={`pt-2 border-t border-white/10 ${projectFile ? "opacity-40" : ""}`}>
                    <span className="block text-xs text-gray-400 font-medium mb-1">
                      Cara B: Paste Link Gambar / URL {projectFile && "(Disabled - File device dipilih)"}
                    </span>
                    <input
                      type="text"
                      placeholder="https://... atau /projects/nama.png"
                      value={newProject.Img}
                      disabled={!!projectFile}
                      onChange={(e) => setNewProject({ ...newProject, Img: e.target.value })}
                      className="w-full p-2.5 bg-white/10 rounded-lg border border-white/20 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-all disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Live Demo Link (e.g. https://...)"
                value={newProject.Link}
                onChange={(e) => setNewProject({ ...newProject, Link: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="GitHub Repo Link (atau isi 'Private')"
                value={newProject.Github}
                onChange={(e) => setNewProject({ ...newProject, Github: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tech Stack (pisahkan dengan koma: React, Tailwind)"
                value={newProject.TechStack}
                onChange={(e) => setNewProject({ ...newProject, TechStack: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <textarea
                placeholder="Key Features (pisahkan dengan koma: Realtime Chat, Dark Mode)"
                value={newProject.Features}
                onChange={(e) => setNewProject({ ...newProject, Features: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none h-20"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading ? "Uploading to ImgBB & Saving..." : "Save Project"}
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
                  onClick={() => handleDeleteProject(p)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2.5 rounded-xl border border-red-500/30 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === "certificates" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Add Certificate */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#6366f1]" /> Add New Certificate
            </h2>
            <form onSubmit={handleAddCertificate} className="space-y-4">
              <input
                type="text"
                placeholder="Certificate Title"
                value={newCertificate.Title}
                onChange={(e) => setNewCertificate({ ...newCertificate, Title: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Issuer (e.g. Dicoding, Coursera)"
                value={newCertificate.Issuer}
                onChange={(e) => setNewCertificate({ ...newCertificate, Issuer: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">Gambar Sertifikat (Gunakan salah satu cara)</label>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className={newCertificate.ImgSertif ? "opacity-40" : ""}>
                    <span className="block text-xs text-[#6366f1] font-medium mb-1.5">
                      Cara A: Upload File dari Device (ImgBB) {newCertificate.ImgSertif && "(Disabled - URL terisi)"}
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
                          title="Batal pilih file"
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
                        className="w-full p-2 bg-white/10 rounded-lg text-xs border border-white/20 text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-[#6366f1] file:text-white file:text-xs cursor-pointer disabled:cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div className={`pt-2 border-t border-white/10 ${certFile ? "opacity-40" : ""}`}>
                    <span className="block text-xs text-gray-400 font-medium mb-1">
                      Cara B: Paste Link Gambar / URL {certFile && "(Disabled - File device dipilih)"}
                    </span>
                    <input
                      type="text"
                      placeholder="https://... atau /certificates/nama.png"
                      value={newCertificate.ImgSertif}
                      disabled={!!certFile}
                      onChange={(e) => setNewCertificate({ ...newCertificate, ImgSertif: e.target.value })}
                      className="w-full p-2.5 bg-white/10 rounded-lg border border-white/20 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-all disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Issue Date (e.g. Nov 2024)"
                value={newCertificate.Date}
                onChange={(e) => setNewCertificate({ ...newCertificate, Date: e.target.value })}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading ? "Uploading to ImgBB & Saving..." : "Save Certificate"}
              </button>
            </form>
          </div>

          {/* Certificate List */}
          <div className="lg:col-span-2 space-y-4">
            {certificates.map((c, index) => {
              const imgUrl = c.Img || c.ImgSertif || "";
              let title = c.Title || c.Name || c.name;
              if (!title && imgUrl) {
                const rawName = decodeURIComponent(imgUrl.split("/").pop() || "");
                title = rawName.split("?")[0].replace(/\.[^/.]+$/, "");
              }
              return (
                <div key={c.id || index} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt="Certificate"
                        className="w-16 h-12 object-cover rounded-lg border border-white/10"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{title || `Sertifikat #${index + 1}`}</h3>
                      <p className="text-gray-400 text-sm">{c.Issuer || "Personal Certificate"} {c.Date ? `• ${c.Date}` : ""}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCertificate(c)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2.5 rounded-xl border border-red-500/30 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">CV Document Link (Gunakan salah satu cara)</label>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <div className={cvFile ? "opacity-40" : ""}>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1.5">
                    ⭐ Cara A (Rekomendasi Utama): Link Google Drive / Link PDF Online {cvFile && "(Disabled - File device dipilih)"}
                  </span>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/... (Upload ke Drive & paste link di sini)"
                    value={profileInfo.cvUrl || ""}
                    disabled={!!cvFile}
                    onChange={(e) => setProfileInfo({ ...profileInfo, cvUrl: e.target.value })}
                    className="w-full p-3 bg-white/10 rounded-lg border border-emerald-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    *Membuka PDF Viewer resmi di browser pengunjung (bisa dibaca, di-scroll & di-download tanpa kedaluwarsa).
                  </p>
                </div>

                <div className={`pt-2 border-t border-white/10 ${profileInfo.cvUrl ? "opacity-40" : ""}`}>
                  <span className="block text-xs text-gray-400 font-medium mb-1.5">
                    Cara B (Opsional): Upload File CV dari Device (.pdf / Gambar) {profileInfo.cvUrl && "(Disabled - Link Drive terisi)"}
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
                        title="Batal pilih file"
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
