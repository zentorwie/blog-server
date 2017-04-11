module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      let status = e.status || 500
      let message = e.message || 'Server error'
      let errors = e.errors

      if (e.name === 'ValidationError') {
        status = 422
        message = e.message
      }
      if (status === 500) {
        console.log(e)
      }

      ctx.status = status
      ctx.body = {
        message
      }

      if (process.env.NODE_ENV !== 'production' && errors) {
        ctx.body.errors = errors
      }
    }
  }
}
