import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const insert = (user) => {
  const clRef = collection(db, 'users')
  const data = marshallUser(user)
  // console.log('adding user', data)
  const docRef = doc(db, 'users', user.uid)
  getDoc(docRef).then((snap) => {
    if (snap.exists()) {
      updateDoc(snap.ref, data)
    } else {
      addDoc(clRef, data)
    }
  })
}

const marshallUser = (u) => {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    phoneNumber: u.phoneNumber,
    photoURL: u.photoURL
  }
}
