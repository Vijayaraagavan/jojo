import { getExpenses } from './main.js'
import { singleGroupTransaction, getGroupUsers } from '@/modules/database/groups'
import { getCategories } from './settings'
export const getAllTransaction = (id, filter) => {
  return new Promise((s, f) => {
    getExpenses(id, { search: '', filter: filter }).then((resp) => {
      getCategories(id[0], 'all').then((categories) => {
        s({
          transactionWise: transactionWise(resp),
          categoryWise: categoryWise(resp, categories),
          available: resp.length >= 1
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
      const formattedSpent = formatSpent(spentResp, fullUsers)
      s({
        transactionWise: transactionWise(resp),
        categoryWise: categoryWise(resp, categories),
        spentWise: formattedSpent,
        settlement: settlementWise(spentResp, fullUsers),
        available: resp.length >= 1
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
  spent[provide.uid].net = spent[provide.uid].expense - spent[provide.uid].consumed
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
  spent[consumer.uid].net = spent[consumer.uid].expense - spent[consumer.uid].consumed
}

const formatSpent = (spentResp, users) => {
  const result = {}
  for (const key in spentResp) {
    let user = users.find((i) => i.uid == key)
    result[user.displayName] = spentResp[key]
  }
  return result
}

const settlementWise = (spentResp, fullUsers) => {
  let result = []
  const loaner = []
  const debter = []
  for (const k in spentResp) {
    const e = spentResp[k]
    if (e.net > 0) {
      loaner.push({ uid: k, net: e.net })
    } else {
      debter.push({ uid: k, net: e.net })
    }
  }
  loaner.sort(netSort)
  debter.sort(netSort)
  settle(loaner, debter, result)
  return formatSettled(result, fullUsers)
}

const netSort = (a, b) => {
  if (a.net > b.net) return 1
  if (a.net < b.net) return -1
  if (a.net == b.net) return -1
}

const settle = (l, d, resp) => {
  if (l.length == 0 || d.length == 0) {
    return resp
  }
  const take = l.pop()
  const give = d.pop()
  const pnet = give.net * -1
  if (take.net > pnet) {
    const diff = take.net - pnet
    take.net = diff
    resp.push({ give: give.uid, take: take.uid, net: pnet })
    l.push(take)
    settle(l, d, resp)
  } else if (take.net < pnet) {
    resp.push({ give: give.uid, take: take.uid, net: take.net })
    give.net += take.net
    d.push(give)
    settle(l, d, resp)
  } else {
    resp.push({ give: give.uid, take: take.uid, net: take.net })
  }
}

const formatSettled = (spent, users) => {
  const resp = []
  spent.forEach((s) => {
    const giveUser = users.find((i) => i.uid == s.give)
    const takeUser = users.find((i) => i.uid == s.take)
    resp.push({
      give: {
        displayName: giveUser.displayName,
        color: giveUser.color
      },
      take: {
        displayName: takeUser.displayName,
        color: takeUser.color
      },
      net: s.net
    })
  })
  return resp
}
