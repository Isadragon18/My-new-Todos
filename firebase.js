const dotenv = require('dotenv');
dotenv.config();
const {initializeApp} = require('firebase/app');
const {errorHandler} = require('./helpers');
const {getFirestore, doc, setDoc, collection, getDocs, query} = require('firebase/firestore');
//const { getDocs } = require('firebase/firestore/lite');


const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN, 
    FIREBASE_DATABASE_URL, 
    FIREBASE_PROJECT_ID, 
    FIREBASE_STORAGE_BUCKET, 
    FIREBASE_MESSAGING_SENDER_ID, 
    FIREBASE_APP_ID, 
    FIREBASE_MEASUREMENT_ID} = process.env;

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

let app;
let firestoreDb;

const initializeFirebase = () => {
    try {
        app = initializeApp(firebaseConfig);
        firestoreDb = getFirestore(app);
        return app;
    } catch (error) {
        errorHandler(error, "initializeFirebase", "axios");
    }
};


const addTodoToFirestore = async (todo) => {
    try {
        const document = doc(firestoreDb, "Isaiah_Todos", todo.uq_id);
        let dataUpdate = await setDoc(document, todo);
        console.log("Todo added to Firestore successfully");
    } catch (error) {
        errorHandler(error, "addTodoToFirestore", "axios");
    }
};

async function getAll() {
    try{
        let itemList = [];
        const querySnapshot = await getDocs(collection(firestoreDb, 'Isaiah_Todos'));
        querySnapshot.forEach((doc) => {
            itemList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        })

        return itemList;
    }catch (error) {
        errorHandler(error, "getFirestoreDb", "axios");
    } 
};

const getFirebaseApp = () => app;


module.exports = {
    initializeFirebase,
    getFirebaseApp,
    addTodoToFirestore,
    getAll
};