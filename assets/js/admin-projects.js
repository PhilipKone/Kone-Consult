// admin-projects.js
// Admin interface for managing portfolio projects using Firebase Firestore
// Features: add, edit, delete, publish/unpublish, and manage project drafts

// admin-projects.js
// Admin interface for managing portfolio projects using Firebase Firestore (compat API, no modules)
// Features: add, edit, delete, publish/unpublish, and manage project drafts

// Use global firebase object from CDN
const db = firebase.firestore();
const auth = firebase.auth();
const projectsCol = db.collection("projects");

// DOM Elements
const projectForm = document.getElementById("projectForm");
const projectsTableBody = document.getElementById("projectsTableBody");
const addProjectBtn = document.getElementById("addProjectBtn");
let modal = null;
try {
  modal = new bootstrap.Modal(document.getElementById("projectModal"));
} catch (e) {
  console.error("Could not initialize Bootstrap modal for #projectModal", e);
}
let editProjectId = null;

// Render projects in the admin table
function renderProjects(snapshot) {
  projectsTableBody.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.title}</td>
      <td>${data.tools || "-"}</td>
      <td>${data.status}</td>
      <td>${data.githubUrl ? `<a href='${data.githubUrl}' target='_blank'>GitHub</a>` : "-"}</td>
      <td>
        <button class='btn btn-sm btn-primary edit-project' data-id='${docSnap.id}'>Edit</button>
        <button class='btn btn-sm btn-danger delete-project' data-id='${docSnap.id}'>Delete</button>
        <button class='btn btn-sm btn-secondary toggle-status' data-id='${docSnap.id}'>${data.status === "published" ? "Unpublish" : "Publish"}</button>
      </td>
    `;
    projectsTableBody.appendChild(tr);
  });
}

// Listen to real-time updates
projectsCol.onSnapshot((snapshot) => {
  renderProjects(snapshot.docs);
});

// Open modal for new project
if (addProjectBtn && projectForm) {
  addProjectBtn.addEventListener("click", () => {
    projectForm.reset();
    editProjectId = null;
    if (modal && typeof modal.show === 'function') {
      modal.show();
    } else if (window.$) {
      $("#projectModal").modal("show");
    } else {
      alert("Modal could not be opened. Please check Bootstrap JS is loaded.");
    }
  });
} else {
  console.error("addProjectBtn or projectForm not found in DOM");
}

// Add or update project
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(projectForm);
  const projectData = {
    title: formData.get("title"),
    description: formData.get("description"),
    tools: formData.get("tools"),
    githubUrl: formData.get("githubUrl"),
    imageUrl: formData.get("imageUrl"),
    notes: formData.get("notes"),
    status: formData.get("status"),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  try {
    if (editProjectId) {
      await projectsCol.doc(editProjectId).update(projectData);
    } else {
      await projectsCol.add(projectData);
    }
    modal.hide();
  } catch (err) {
    alert("Error saving project: " + err.message);
  }
});

// Edit, Delete, Publish/Unpublish handlers
projectsTableBody.addEventListener("click", async (e) => {
  const id = e.target.getAttribute("data-id");
  if (e.target.classList.contains("edit-project")) {
    // Load project data into form
    const docSnap = await projectsCol.doc(id).get();
    if (docSnap.exists) {
      const d = docSnap.data();
      projectForm.title.value = d.title || "";
      projectForm.description.value = d.description || "";
      projectForm.tools.value = d.tools || "";
      projectForm.githubUrl.value = d.githubUrl || "";
      projectForm.imageUrl.value = d.imageUrl || "";
      projectForm.notes.value = d.notes || "";
      projectForm.status.value = d.status || "draft";
      editProjectId = id;
      if (modal && typeof modal.show === 'function') {
        modal.show();
      } else if (window.$) {
        $("#projectModal").modal("show");
      }
    }
  } else if (e.target.classList.contains("delete-project")) {
    if (confirm("Delete this project?")) {
      await projectsCol.doc(id).delete();
    }
  } else if (e.target.classList.contains("toggle-status")) {
    const docSnap = await projectsCol.doc(id).get();
    if (docSnap.exists) {
      const currentStatus = docSnap.data().status;
      await projectsCol.doc(id).update({ status: currentStatus === "published" ? "draft" : "published" });
    }
  }
});

// Only allow access if user is authenticated (admin)
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  }
});
