import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA8RsymVZYFI68g7C3prcMrhDwUe5UiFr4",
    authDomain: "crud-personal-4bf40.firebaseapp.com",
    projectId: "crud-personal-4bf40",
    storageBucket: "crud-personal-4bf40.appspot.com",
    messagingSenderId: "786029167111",
    appId: "1:786029167111:web:355bdce7e98c4a126fe0a2"
};

firebase.initializeApp(firebaseConfig);

export {firebase}

