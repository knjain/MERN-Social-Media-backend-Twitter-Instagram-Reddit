module.exports = {
  success200: (res, data, msg) => {
    return res.status(200).json({
      data: data,
      message: msg || "Success",
      success: true,
    });
  },

  success201: (res, data, msg) => {
    return res.status(201).json({
      data: data,
      message: msg || "Created",
      success: true,
    });
  },
};
