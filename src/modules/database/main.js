import { db } from '@/modules/firebase'
import { addDoc, collection, getDocs } from 'firebase/firestore'

const all = () => {
  const items = []
  console.log('getting docs')
  getDocs(collection(db, 'expense'))
    .then((snapshot) => {
      console.log('filter docs', snapshot)

      snapshot.docs.forEach((doc) => {
        items.push({ data: doc.data(), id: doc.id })
      })
      console.log('doc items', items)
    })
    .catch((err) => console.log(err))
  return items
  //   db.collection('databox')
  //     .get()
  //     .then()
}

const writeDoc = async (doc, data) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), data)
    console.log('data written')
  } catch (error) {
    console.log(error)
  }
}

const addExpense = (data) => {
  addDoc(collection(db, 'expense'), data)
    .then((snapshot) => {
      console.log('filter docs', snapshot)
    })
    .catch((err) => console.log(err))
}

const getExpenses = (id) => {
  return new Promise((s, f) => {
    const items = []
    getDocs(collection(db, 'expense'))
      .then((snapshot) => {
        snapshot.docs.forEach((item) => {
          if (item.data().userId == id) {
            console.log(item.data().userId, id)
            items.push(item.data())
          }
        })
        s(items)
      })
      .catch((err) => f(err))
  })
}

export { all, writeDoc, addExpense, getExpenses }
