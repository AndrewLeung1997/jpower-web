import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/firebase-firestore";
import "firebase/firebase-database";
import "firebase/firebase-storage";

const config = {
    apiKey: "AIzaSyAAQpegNRtJBkq0dNxqtVrfo6qVsl0dAz4",
    authDomain: "jpower-8c20e.firebaseapp.com",
    databaseURL: "https://jpower-8c20e-default-rtdb.firebaseio.com",
    projectId: "jpower-8c20e",
    storageBucket: "jpower-8c20e.appspot.com",
    messagingSenderId: "37696400857",
    appId: "1:37696400857:web:73f50fe3cbd218a38e7dc8",
    measurementId: "G-6Q2EEV94JZ",
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.db = app.database();
        this.dbstore = app.firestore();
        this.auth = app.auth();
        this.storage = app.storage();
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    async register(name, email, password) {
        await this.auth.createUserWithEmailAndPassword(email, password);

        return this.auth.currentUser.updateProfile({
            displayName: name,
        });
    }

    addData(nickName, englishName, email, phoneNumber) {
        if (!this.auth.currentUser) {
            return "Not authorized User!";
        }

        return this.db.ref("UserList/").push({
            nickName,
            englishName,
            email,
            phoneNumber,
        });
    }

    addMetaData(url, category, uploadDate, videoName) {
        if (!this.auth.currentUser) {
            return "Not authorized User";
        }
        return this.db.ref("VideoList/").push({
            url,
            category,
            uploadDate,
            videoName,
        });
    }

    isInitialized() {
        return new Promise((resolve) => {
            this.auth.onAuthStateChanged(resolve);
        });
    }

    getCurrentUsername() {
        return this.auth.currentUser && this.auth.currentUser.displayName;
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }
}

export default new Firebase();
export const db = app.firestore();
