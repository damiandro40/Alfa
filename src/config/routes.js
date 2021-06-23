const initializeRoutes = (app) => {

    app.use('*', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST'])
        res.setHeader('Access-Control-Allow-Headers', '*')
        next()
    })

    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Invalid path', success: false })
    })

    app.use('*', (err, req, res, next) => {
        res.status(500).json({ message: 'An error occured', success: false })
    })

}

module.exports = initializeRoutes