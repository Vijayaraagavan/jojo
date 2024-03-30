import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  documentId,
  orderBy,
  collection
} from 'firebase/firestore'
import { db } from '../firebase'

export const getSettings = (id) => {
  const clRef = collection(db, 'settings')
  const q = query(clRef, where('uid', '==', id))
  const result = []
  return new Promise((s, f) => {
    getDocs(q)
      .then((snap) => {
        snap.docs.forEach((d) => {
          result.push({ ...d.data(), id: d.id })
        })
        if (result.length == 0) {
          f('no settings found')
        } else {
          s(result[0])
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

export const saveSettings = (id, data) => {
  const clRef = collection(db, 'settings')
  const docRef = doc(db, 'settings', id)
  return new Promise((s, f) => {
    updateDoc(docRef, data)
      .then(() => {
        s('setting stored')
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
export const newSettings = (data) => {
  const clRef = collection(db, 'settings')
  return new Promise((s, f) => {
    addDoc(clRef, data)
      .then(() => {
        s('setting stored')
      })
      .catch((err) => {
        console.log(err)
        f()
      })
  })
}

export const getCategories = (id, mode) => {
  return new Promise((s) => {
    getSettings(id)
      .then((setting) => {
        let total = []
        if (mode == 'all') {
          total = setting.categories
        } else {
          total = setting.categories.filter((i) => i.active == true)
        }
        if (total.length > 0) {
          s(setting.categories)
        } else {
          s([{ name: 'General', active: true, uid: -1 }])
        }
      })
      .catch((msg) => {
        console.log(msg)
        s([{ name: 'General', active: true, uid: -1 }])
      })
  })
}

export const verifySettings = (id) => {
  getSettings(id).catch((msg) => {
    if (msg.includes('no settings')) {
      newSettings(getInitSettings(id))
    }
  })
}

export const getInitSettings = (id) => {
  return {
    uid: id,
    pkey: 10,
    categories: [
      { name: 'Food', uid: 1, active: true },
      { name: 'Drinks', uid: 2, active: true },
      { name: 'Transportation', uid: 3, active: true },
      { name: 'Tickets', uid: 4, active: true },
      { name: 'Groceries', uid: 5, active: true },
      { name: 'Rent & Utilities', uid: 6, active: true },
      { name: 'Accomodation', uid: 7, active: true },
      { name: 'General', uid: -1, active: true }
    ]
  }
}
