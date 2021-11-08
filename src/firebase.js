import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/firebase-database'
import 'firebase/firebase-storage'


const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL : process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
}

class Firebase {
    constructor() {
        app.initializeApp(config)
        this.db = app.database()
        this.dbstore = app.firestore()
        this.auth = app.auth()
        this.storage = app.storage()

    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    logout() {
        return this.auth.signOut()
    }


    async register(name, email, phoneNumber, password) {
        await this.auth.createUserWithEmailAndPassword(email, password)

        return this.auth.currentUser.updateProfile({
            displayName: name
        })

    }

    addData(nickName, englishName, email, phoneNumber) {
        if (!this.auth.currentUser) {
            return ('Not authorized User!')
        }

        return this.db.ref('UserList/').push({
            nickName,
            englishName,
            email,
            phoneNumber
        })
    }

    addMetaData(url, category, uploadDate, videoName){
        if(!this.auth.currentUser){
            return ('Not authorized User')
        }
        return this.db.ref('VideoList/').push({
            url,
            category,
            uploadDate,
            videoName
        })
    }


    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }

    getCurrentUsername() {
        return this.auth.currentUser && this.auth.currentUser.displayName
    }


}

export default new Firebase()