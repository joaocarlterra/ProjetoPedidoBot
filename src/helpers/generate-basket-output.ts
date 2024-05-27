const generateBasketOutput = (keys: any, items: any) => {
  const typeKeys = keys.filter((key: any) => !key.includes('amount') && key !== 'number')
  const amountKeys = keys.filter((key: any) => key.includes('amount'))
  
  let formattedString = typeKeys.map((typeKey: any, index: any) => {
    const amountKey = amountKeys[index];

    return `${items[amountKey]} ${items[typeKey]}`;
  }).join(', ')

  const lastCommaIndex = formattedString.lastIndexOf(',')
  if (lastCommaIndex !== -1) {
    formattedString = formattedString.substring(0, lastCommaIndex) + ' e' + formattedString.substring(lastCommaIndex + 1)
  }

  return formattedString
}

export default generateBasketOutput