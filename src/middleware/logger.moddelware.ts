// Logging middleware 
import type { Request, Response, NextFunction } from 'express'

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  console.log('--- REQUEST START ---')
  console.log('Time:', new Date().toISOString())
  console.log('Method:', req.method)
  console.log('URL:', req.originalUrl)
  console.log('IP:', req.ip)
  console.log('Query:', req.query)
  console.log('Params:', req.params)
  console.log('Headers:', {
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type'],
  })
  console.log('Body:', req.body)

  res.on('finish', () => {
    const duration = Date.now() - start
    console.log('--- REQUEST END ---')
    console.log('Status:', res.statusCode)
    console.log('Duration:', `${duration}ms`)
  })

  next()
}