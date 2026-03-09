// 1. Standardize imports to use the CDN for everything
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDg86EeU7QCUVxrK8WtYp6P0xA2UaMMdkg",
  authDomain: "zellstarr-creations-29c8b.firebaseapp.com",
  projectId: "zellstarr-creations-29c8b",
  storageBucket: "zellstarr-creations-29c8b.firebasestorage.app",
  messagingSenderId: "1069198211453",
  appId: "1:1069198211453:web:afc0ddb9a01b5c59293414",
  measurementId: "G-542TEYBRND",
};

// 2. Initialize Firebase FIRST
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Pass 'app' into Firestore

const grid = document.getElementById("builds-grid");

// 3. Helper function to fix GitHub links on the fly
// This automatically swaps 'blob' to 'raw' so your images actually show up!
function getRawGitHubUrl(url) {
  return url
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");
}

function renderBuild(doc) {
  const data = doc.data();
  const imageUrl = getRawGitHubUrl(data.imageURL);

  const card = `
    <div class="build-card">
      <img src="${imageUrl}" alt="${data.title}" style="width:100%; border-radius: 8px;">
      <h3>${data.title}</h3>
      <span class="tag-badge">${data.tag}</span>
    </div>
  `;
  grid.innerHTML += card;
}

// Fetch Functions (Keeping your logic, it's solid!)
// Fetch EVERYTHING
async function fetchAllBuilds() {
  if (!grid) return;

  // Show loading state
  grid.innerHTML = '<p class="loading-text">Loading builds...</p>';

  try {
    const querySnapshot = await getDocs(collection(db, "builds"));
    grid.innerHTML = ""; // Clear the loading text
    querySnapshot.forEach((doc) => renderBuild(doc));
  } catch (error) {
    grid.innerHTML = '<p class="error-text">Failed to load builds.</p>';
    console.error(error);
  }
}

// Fetch by TAG
async function fetchByTag(selectedTag) {
  if (!grid) return;

  grid.innerHTML = `<p class="loading-text">Filtering for ${selectedTag}...</p>`;

  try {
    const q = query(collection(db, "builds"), where("tag", "==", selectedTag));
    const querySnapshot = await getDocs(q);
    grid.innerHTML = ""; // Clear the loading text

    if (querySnapshot.empty) {
      grid.innerHTML =
        '<p class="loading-text">No builds found for this tag.</p>';
    } else {
      querySnapshot.forEach((doc) => renderBuild(doc));
    }
  } catch (error) {
    grid.innerHTML = '<p class="error-text">Error filtering builds.</p>';
  }
}

// Initial Load
fetchAllBuilds();

// --- UI Logic (Back to Top & Hamburger) ---

const backToTopButton = document.getElementById("backToTop");
window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger-icon");
  const navMenu = document.getElementById("nav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen);
    });
  }
});

document.getElementById("filter-all").addEventListener("click", fetchAllBuilds);
document
  .getElementById("filter-lounge")
  .addEventListener("click", () => fetchByTag("Lounge"));
  document
  .getElementById("filter-home")
  .addEventListener("click", () => fetchByTag("Home"));
