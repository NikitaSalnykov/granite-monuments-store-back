const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next)
    }
    catch (error) {
      return res.status(500).json(error)
    }
  }
  return func 
}

module.exports = ctrlWrapper