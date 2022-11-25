const baseObjResponse = (status, message, accessToken, refreshToken, data) => {
  return {
    success: status,
    message: message,
    data: data,
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

const baseDataTableResponse = (status, message, accessToken, refreshToken, data, totalItems, page, pageSize = 20) => {
  return {
    success: status,
    message: message,
    data: data,
    totalItems: totalItems,
    page: page,
    pageSize: pageSize,
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

module.exports = { baseObjResponse, baseDataTableResponse }