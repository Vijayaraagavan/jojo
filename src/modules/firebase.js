import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: '',
  authDomain: 'databox-84f3c.firebaseapp.com',
  projectId: 'databox-84f3c',
  storageBucket: 'databox-84f3c.appspot.com',
  messagingSenderId: '777084455685',
  appId: '1:777084455685:web:b59915a2e0c5551522056c',
  measurementId: 'G-46BCGG67WS'

  // apiKey: 'AIzaSyAfv7ntg-wlSrBUn4A7BK_-REIPExAw6XY', // Can be any non-empty string
  // projectId: 'fake-project-id', // Can be any non-empty string
  // databaseURL: 'http://localhost:9900', // Emulator host and port,
  // appId: 'any-api-id'
}
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
// auth
const auth = getAuth(app)
auth.languageCode = 'it'
//db
const db = getFirestore(app)
if (import.meta.env.MODE != 'production') {
  connectAuthEmulator(auth, 'http://192.168.0.107:9099')
  connectFirestoreEmulator(db, '192.168.0.107', 9900)
}
export { analytics, auth, db }
