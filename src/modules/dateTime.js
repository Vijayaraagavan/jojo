import { format, compareAsc } from 'date-fns'
const dToStr = (date) => {
  return format(new Date(date), 'dd MMM')
}
const dateTimeToStr = (date) => {
  return format(new Date(date), 'dd MMM hh:mm aa')
}

const tToStr = (date) => {
  return format(new Date(date), 'hh:mm aa')
}

const dateTimeToDate = (d) => {
  return format(new Date(d), 'dd MMM')
}

export { dToStr, dateTimeToStr, tToStr, dateTimeToDate }
