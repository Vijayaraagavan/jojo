import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAfv7ntg-wlSrBUn4A7BK_-REIPExAw6XY',
  authDomain: 'databox-84f3c.firebaseapp.com',
  projectId: 'databox-84f3c',
  storageBucket: 'databox-84f3c.appspot.com',
  messagingSenderId: '777084455685',
  appId: '1:777084455685:web:b59915a2e0c5551522056c',
  measurementId: 'G-46BCGG67WS'
}
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
connectAuthEmulator(auth, 'http://127.0.0.1:9099')

export { analytics, auth }
