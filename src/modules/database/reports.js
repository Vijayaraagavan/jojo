import { getExpenses } from './main.js'
import { singleGroupTransaction, getGroupUsers } from '@/modules/database/groups'
import { getCategories } from './settings'
export const getAllTransaction = (id, filter) => {
  return new Promise((s, f) => {
    getExpenses(id, { search: '', filter: filter }).then((resp) => {
      getCategories(id[0], 'all').then((categories) => {
        s({
          transactionWise: transactionWise(resp),
          categoryWise: categoryWise(resp, categories)
        })
      })
    })
  })
}

export const getGroupTransactions = async (id, filter) => {
  return new Promise((s) => {
    let result = null
    let categories = null
    singleGroupTransaction(id, filter).then(async (resp) => {
      const categories = await getCategories(id, 'all')
      const spentResp = spentWise(resp)
      const userIds = Object.keys(spentResp)
      let fullUsers = []
      if (userIds.length) {
        fullUsers = await getGroupUsers(userIds)
      }
      s({
        transactionWise: transactionWise(resp),
        categoryWise: categoryWise(resp, categories),
        spentWise: formatSpent(spentResp, fullUsers)
      })
    })
  })
}

const transactionWise = (data) => {
  const categoryWise = {}
  data.forEach((r) => {
    if (categoryWise[r.date]) {
      categoryWise[r.date].amount += r.amount
      categoryWise[r.date].count + 1
      if (r.amount > categoryWise[r.date].maximum) {
        categoryWise[r.date].maximum = r.amount
      }
    } else {
      categoryWise[r.date] = {
        amount: r.amount,
        count: 1,
        maximum: r.amount
      }
    }
  })
  return categoryWise
}

const categoryWise = (data, categories) => {
  const categoryWise = {}
  data.forEach((r) => {
    // console.log(r)
    let name = getCatName(categories, r.categoryId)
    if (categoryWise[name]) {
      categoryWise[name].amount += r.amount
      categoryWise[name].count + 1
      if (r.amount > categoryWise[name].maximum) {
        categoryWise[name].maximum = r.amount
      }
    } else {
      categoryWise[name] = {
        amount: r.amount,
        count: 1,
        maximum: r.amount
      }
    }
  })
  return categoryWise
}

const getCatName = (categories, id) => {
  const f = categories.find((i) => i.uid == id)
  if (f) {
    return f.name
  } else {
    return 'General'
  }
}

const spentWise = (resp, users) => {
  const spentWise = {}
  resp.forEach((r) => {
    // console.log(r.group, r)
    const provide = r.group.find((i) => i.uid == r.userId)
    const consumer = r.group.filter((i) => i.uid != r.userId)
    addProvider(spentWise, provide, r.amount)
    consumer.forEach((i) => addConsumer(spentWise, i))
  })

  return spentWise
}

const addProvider = (spent, provide, total) => {
  if (!provide) {
    return
  }
  if (spent[provide.uid]) {
    spent[provide.uid].expense += total - provide.amount
  } else {
    spent[provide.uid] = {
      expense: total - provide.amount,
      consumed: 0
    }
  }
}
const addConsumer = (spent, consumer) => {
  if (!consumer) {
    return
  }
  if (spent[consumer.uid]) {
    spent[consumer.uid].consumed += consumer.amount
  } else {
    spent[consumer.uid] = {
      expense: 0,
      consumed: consumer.amount
    }
  }
}

const formatSpent = (spentResp, users) => {
  const result = {}
  for (const key in spentResp) {
    let user = users.find((i) => i.uid == key)
    result[user.displayName] = spentResp[key]
  }
  return result
}
