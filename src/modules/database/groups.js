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

export const newGroup = (group) => {
  const clRef = collection(db, 'groups')
  //   const docRef = doc(db, 'groups', group.name)
  return new Promise((s, f) => {
    // getDoc(docRef).then((snap) => {
    //   if (snap.exists()) {
    //   updateDoc(snap.ref, data)
    //     f('Group name already exist')
    //   } else {
    addDoc(clRef, group)
      .then(() => s('Group created successfully'))
      .catch(() => f('failed to create group'))
    //   }
    // })
  })
}

export const getUserGroups = (id) => {
  const clRef = collection(db, 'groups')
  // console.log(id)
  const q = query(clRef, where('members', 'array-contains', id))
  const groups = []
  return new Promise((s, f) => {
    getDocs(q)
      .then((snap) => {
        snap.docs.forEach((d) => {
          groups.push({ ...d.data(), docId: d.id })
          // console.log(d.data())
        })
        s(groups)
      })
      .catch((err) => console.log(err))
  })
}

export const joinGroupByRef = (userId, refId, name) => {
  const clRef = collection(db, 'groups')
  const q = query(clRef, where('joinId', '==', refId), where('name', '==', name))
  return new Promise((s, f) => {
    getDocs(q)
      .then((snap) => {
        if (snap.docs.length == 0) {
          f('No group found or invalid code')
          return
        }
        if (snap.docs.length > 1) {
          f('Multiple groups found')
          return
        }
        const oGroup = snap.docs[0].data()
        if (!oGroup.members.includes(userId)) {
          oGroup.members.push(userId)
        }
        updateDoc(snap.docs[0].ref, oGroup)
        s(oGroup)
      })
      .catch((err) => console.log(err))
  })
}
