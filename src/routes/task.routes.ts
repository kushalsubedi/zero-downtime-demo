import { Router } from 'express'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} 
from '../controller/task.controller'
import { loggerMiddleware } from '../middleware/logger.moddelware'

export const taskRouter = Router()

taskRouter.get('/',   loggerMiddleware, getAllTasks)
taskRouter.get('/:id',  loggerMiddleware, getTaskById)
taskRouter.post('/',    loggerMiddleware, createTask)
taskRouter.patch('/:id', loggerMiddleware, updateTask)
taskRouter.delete('/:id', loggerMiddleware, deleteTask)