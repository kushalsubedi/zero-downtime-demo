import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/error.middleware'
import { prisma } from '../lib/prisma'


// GET /tasks
// use logger middleware to log the request method and path

export const getAllTasks = async (
  _req: Request, res: Response, next: NextFunction
) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch (e) { next(e) }
}

// GET /tasks/:id
export const getTaskById = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const id = parseInt(String(req.params.id))
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw new AppError(404, 'Task not found')
    res.json(task)
  } catch (e) { next(e) }
}

// POST /tasks
// Required fields: title
/* 
req -> request body: { title: string, description?: string }
response -> 201 Created
{
  id: number,
  title: string,
    description: string | null,
    completed: boolean,
    createdAt: string,
    updatedAt: string
}
    Nextfunction is used to pass the error to the error handling middleware.
     If any error occurs in the try block, it will be caught and passed to the next function, 
     which will then be handled by the error middleware.
*/

export const createTask = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { title, description } = req.body
    if (!title) throw new AppError(400, 'title is required')
    const task = await prisma.task.create({
      data: { title, description }
    })
    res.status(201).json(task)
  } catch (e) { next(e) }
}

// PATCH /tasks/:id
export const updateTask = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const id = parseInt(String(req.params.id))
    const task = await prisma.task.update({
      where: { id },
      data: req.body
    })
    res.json(task)
  } catch (e) { next(e) }
}

// DELETE /tasks/:id
export const deleteTask = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const id = parseInt(String(req.params.id))
    await prisma.task.delete({ where: { id } })
    res.status(204).send()
  } catch (e) { next(e) }
}