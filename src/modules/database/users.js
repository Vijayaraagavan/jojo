import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from '../firebase'

export const insert = (user) => {
  const clRef = collection(db, 'users')
  const data = marshallUser(user)
  // console.log('adding user', data)
  // const docRef = doc(db, 'users', user.uid)
  const q = query(clRef, where('uid', '==', user.uid))
  getDocs(q).then((snap) => {
    if (snap.docs.length == 1) {
      const d = snap.docs[0]
      console.log(snap, snap.docs.length, snap.docs[0].data(), d)
      updateDoc(d.ref, data)
    } else {
      addDoc(clRef, data)
    }
  })
}

const marshallUser = (u) => {
  const cuser = u.email.split('@')
  const dName = !u.displayName ? cuser[0] : u.displayName
  return {
    uid: u.uid,
    email: u.email,
    displayName: dName,
    phoneNumber: u.phoneNumber,
    photoURL: u.photoURL,
    customName: cuser[0]
  }
}
