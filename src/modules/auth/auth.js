import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider
} from 'firebase/auth'

const provider = new GoogleAuthProvider()
// export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
// export GCLOUD_PROJECT="databox-84f3c"
// emulators:start

const creatUserWithEmail = (email, password) => {
  return new Promise((s, f) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user
        console.log('created', user)
        s(user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(error)
        f(errorCode)
        // ..
      })
  })
}

const signInWithEmail = (email, password) => {
  return new Promise((s, f) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log('logged in', userCredential)
        s(user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(error.message, errorCode)
        f(errorCode)
      })
  })
}

const signInWithProvider = (id, cb) => {
  const provider = getProvider(id)
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      console.log('google user', user)
      cb(user)
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('google error', error)

      // ...
    })
}

const getProvider = (id) => {
  if (id.includes('google')) {
    return new GoogleAuthProvider()
  } else if (id.includes('facebook')) {
    return new FacebookAuthProvider()
  } else if (id.includes('twitter')) {
    return new TwitterAuthProvider()
  }
  return new GoogleAuthProvider()
}

const authorized = () => {
  return new Promise((s, f) => {
    auth.onAuthStateChanged((user) => {
      console.log('aft', user)
      if (user != null) {
        s(user)
      } else {
        f('failure')
      }
    })
  })
}

const save = () => {
  console.log('svings ')
  setPersistence(auth, browserLocalPersistence)
    .then((resp) => {
      console.log(resp)
    })
    .catch((err) => {
      console.log(err)
    })
}
const signOut = (cb) => {
  auth
    .signOut()
    .then((resp) => {
      console.log(resp)
      cb()
    })
    .catch((err) => {
      console.log(err)
    })
}
export { creatUserWithEmail, signInWithEmail, authorized, save, signOut, signInWithProvider }
