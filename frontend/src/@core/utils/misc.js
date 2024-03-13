export function addTime(date, second) {
    date.setTime(date.getTime() + second * 1000)
  
    return date
  }