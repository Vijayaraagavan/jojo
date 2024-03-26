import { db } from '@/modules/firebase'
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { dToStr, dateTimeToStr } from '../dateTime'

const all = () => {
  const items = []
  // console.log('getting docs')
  getDocs(collection(db, 'expense'))
    .then((snapshot) => {
      // console.log('filter docs', snapshot)

      snapshot.docs.forEach((doc) => {
        items.push({ data: doc.data(), id: doc.id })
      })
      // console.log('doc items', items)
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
    // console.log('data written')
  } catch (error) {
    console.log(error)
  }
}

const addExpense = (data) => {
  return new Promise((s, f) => {
    addDoc(collection(db, 'expense'), data)
      .then((snapshot) => {
        // console.log('filter docs', snapshot);
        s('Expense added')
      })
      .catch((err) => {
        console.log(err)
        f('Operation failed due to ' + err.errorMessage)
      })
  })
}

const getExpenses = (id, { search, filter }) => {
  return new Promise((s, f) => {
    if (!id) {
      s([])
      return
    }
    const items = []
    let count = 1
    const cl = collection(db, 'expense')
    let q = query(cl, orderBy('dateTime', 'desc'))
    if (search != '' && !!search && filter.id == 'title') {
      let end = search + '\uf8ff'
      q = query(q, where(filter.id, '>=', search), where(filter.id, '<=', end))
    }
    if (filter.id == 'amount') {
      q = query(q, where(filter.id, '==', Number(search)))
    }
    getDocs(q)
      .then((snapshot) => {
        snapshot.docs.forEach((item) => {
          if (item.data().userId == id) {
            // console.log(item.data().userId, id)
            items.push(formatExpense(item.data(), count))
            count++
          }
        })
        s(items)
      })
      .catch((err) => f(err))
  })
}

const formatExpense = (data, count) => {
  return {
    id: count,
    dateTime: dateTimeToStr(data.dateTime),
    amount: data.amount,
    amountStr: data.amountStr,
    title: data.title,
    userId: data.userId
  }
}

export { all, writeDoc, addExpense, getExpenses }
