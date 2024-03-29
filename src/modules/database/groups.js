import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  documentId,
  orderBy
} from 'firebase/firestore'
import { addUserToGroup, getUser } from './users'
import { dToStr, dateTimeToStr } from '../dateTime'
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
      .then((resp) => {
        addUserToGroup(group.members[0], resp.id)
        s('Group created successfully')
      })
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
        updateDoc(snap.docs[0].ref, oGroup).then(() => {
          addUserToGroup(userId, snap.docs[0].id)
        })
        s(oGroup)
      })
      .catch((err) => console.log(err))
  })
}

export const getGroupUsers = (memberIds) => {
  const clRef = collection(db, 'users')
  const q = query(clRef, where('uid', 'in', memberIds))
  const users = []
  return new Promise((s, f) => {
    getDocs(q)
      .then((snap) => {
        snap.docs.forEach((d) => {
          users.push({
            ...d.data(),
            id: d.id,
            color: Math.floor(Math.random() * 16777215).toString(16)
          })
        })
        s(users)
      })
      .catch((err) => {
        console.log(err)
        f(err)
      })
  })
}

export const getGroup = (id) => {
  const clRef = collection(db, 'groups')
  const docRef = doc(db, 'groups', id)
  return new Promise((s, f) => {
    getDoc(docRef).then((snap) => {
      const d = snap.data()
      s({ ...d, id: snap.id })
    })
  })
}
export const getGroups = (ids) => {
  const clRef = collection(db, 'groups')
  const q = query(clRef, where(documentId(), 'in', ids))
  const groups = []
  return new Promise((s, f) => {
    getDocs(q).then((snap) => {
      snap.docs.forEach((d) => {
        groups.push({ ...d.data(), id: d.id })
      })
      s(groups)
    })
  })
}

export const addSplit = (data) => {
  const clRef = collection(db, 'group_transactions')
  return new Promise((s, f) => {
    addDoc(clRef, data)
      .then(() => s())
      .catch(() => f('Split creation failed'))
  })
}
export const modifySplit = (id, data) => {
  const clRef = collection(db, 'group_transactions')
  const docRef = doc(db, 'group_transactions', id)
  return new Promise((s, f) => {
    updateDoc(docRef, data)
      .then(() => s())
      .catch((err) => {
        console.log(err)
        f('Split creation failed')
      })
  })
}

export const groupTransactions = (uid) => {
  return new Promise((s, f) => {
    if (!uid) {
      f('no proper id')
      return
    }
    const clRef = collection(db, 'group_transactions')
    const resp = []
    const groups = []
    let count = 1
    getUser(uid).then((user) => {
      const q = query(clRef, where('groupId', 'in', user.groups), orderBy('dateTime', 'desc'))
      getDocs(q)
        .then((snap) => {
          snap.docs.forEach((d) => {
            // resp.push({ ...d.data(), id: d.id })
            const data = d.data()
            resp.push(formatExpense(data, d.id, count))
            if (!groups.includes(data.groupId)) {
              groups.push(data.groupId)
            }
            count++
          })

          s({
            resp,
            groups
          })
        })
        .catch((err) => {
          console.log(err)
          f('Error while fetching')
        })
    })
  })
}

const formatExpense = (d, id, count) => {
  return {
    id: count,
    dateTime: dateTimeToStr(d.dateTime),
    amount: d.amount,
    amountStr: d.amountStr,
    title: d.title,
    userId: d.userId,
    group: d.group,
    groupId: d.groupId,
    uid: id,
    dateTimeInSec: d.dateTime
  }
}
