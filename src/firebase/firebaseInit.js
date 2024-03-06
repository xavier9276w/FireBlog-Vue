// Your web app's Firebase configuration
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCqyuypGOBAqlRnU-5cMiO08n-jALV5KxE",
    authDomain: "fireblog-ge.firebaseapp.com",
    projectId: "fireblog-ge",
    storageBucket: "fireblog-ge.appspot.com",
    messagingSenderId: "275623118285",
    appId: "1:275623118285:web:d104383f0c10584061b084"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();