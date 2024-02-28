const http = require('http')
const { URL } = require('url')
const Wappalyzer = require('./driver')

const options = {}

const server = http.createServer(async (req, res) => {
  // Parse the URL to get the query parameters
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
  const url = parsedUrl.searchParams.get('url')

  const wappalyzer = new Wappalyzer(options)

  try {
    const storage = {
      local: {},
      session: {},
    }

    await wappalyzer.init()

    const site = await wappalyzer.open(url, {}, storage)

    await new Promise((resolve) =>
      setTimeout(resolve, parseInt(options.defer || 0, 10))
    )

    const results = await site.analyze()
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(JSON.stringify(results))
    await wappalyzer.destroy()
  } catch (error) {
    try {
      await Promise.race([
        wappalyzer.destroy(),
        new Promise((resolve, reject) =>
          setTimeout(
            () => reject(new Error('Attempt to close the browser timed out')),
            5000
          )
        ),
      ])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message || String(error))
    }

    // eslint-disable-next-line no-console
    console.error(error.message || String(error))
  }
})

const PORT = 8080
const HOSTNAME = 'http://localhost'

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Server is running at ${HOSTNAME}:${PORT}/`)
})
