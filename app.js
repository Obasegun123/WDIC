import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Your Firebase configuration

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MESUREMENT_ID
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In
document.getElementById('google-sign-in').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('meal-section').classList.remove('hidden');
    loadMeals();
  } catch (error) {
    console.error('Error signing in:', error);
  }
});

// Save Meal
document.getElementById('meal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mealName = document.getElementById('meal-name').value;
  const sideName = document.getElementById('side-name').value;
  const difficulty = document.getElementById('difficulty').value;
  const ingredients = document.getElementById('ingredients').value.split(',');

  try {
    await addDoc(collection(db, 'meals'), {
      mealName,
      sideName,
      difficulty,
      ingredients,
      userId: auth.currentUser.uid
    });
    alert('Meal saved!');
    loadMeals();
  } catch (error) {
    console.error('Error saving meal:', error);
  }
});

// Load Meals
async function loadMeals() {
  const mealList = document.getElementById('meal-list');
  mealList.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'meals'));
  querySnapshot.forEach((doc) => {
    const meal = doc.data();
    const mealCard = document.createElement('div');
    mealCard.className = 'meal-card';
    mealCard.innerHTML = `
      <h3>${meal.mealName}</h3>
      <p><strong>Side:</strong> ${meal.sideName}</p>
      <p><strong>Difficulty:</strong> ${meal.difficulty}</p>
      <p><strong>Ingredients:</strong> ${meal.ingredients.join(', ')}</p>
    `;
    mealList.appendChild(mealCard);
  });
}