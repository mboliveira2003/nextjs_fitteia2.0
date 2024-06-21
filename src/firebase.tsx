import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXLcZ9042s1VjLze4PiKB-fvNSdMihpJ8",
  authDomain: "fitteia2.firebaseapp.com",
  projectId: "fitteia2",
  storageBucket: "fitteia2.appspot.com",
  messagingSenderId: "268963156948",
  appId: "1:268963156948:web:707c2e6eee093e4c00bc41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "pt";
const googleAuthProvider = new GoogleAuthProvider();

// Initialize Firebase and export
export { auth, googleAuthProvider };
export default app;
