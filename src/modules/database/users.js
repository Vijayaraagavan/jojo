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
  return new Promise((s, f) => {
    getDocs(q).then((snap) => {
      if (snap.docs.length == 1) {
        const d = snap.docs[0]
        console.log(snap, snap.docs.length, snap.docs[0].data(), d)
        updateDoc(d.ref, data)
          .then(() => s())
          .catch(() => f())
      } else {
        addDoc(clRef, data)
          .then(() => s())
          .catch(() => f())
      }
    })
  })
}

export const addUserToGroup = (uid, groupId) => {
  const clRef = collection(db, 'users')
  const q = query(clRef, where('uid', '==', uid))
  return new Promise((s, f) => {
    getDocs(q)
      .then((snap) => {
        if (snap.docs.length == 1) {
          const d = snap.docs[0]
          const user = addGroupId(d.data(), groupId)
          updateDoc(d.ref, user)
          s()
        } else {
          f('user not found')
        }
      })
      .catch((msg) => {
        console.log(msg)
        f(msg)
      })
  })
}

const addGroupId = (data, groupId) => {
  if (data.groups) {
    if (data.groups.includes(groupId)) {
      return data
    } else {
      data.groups.push(groupId)
      return data
    }
  } else {
    data.groups = [groupId]
    return data
  }
}

export const getUser = (uid) => {
  const clRef = collection(db, 'users')
  const q = query(clRef, where('uid', '==', uid))
  return new Promise((s, f) => {
    getDocs(q).then((snap) => {
      if (snap.docs.length == 1) {
        const d = snap.docs[0]
        s({ ...d.data(), id: d.id })
      } else {
        f('user not found')
      }
    })
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
