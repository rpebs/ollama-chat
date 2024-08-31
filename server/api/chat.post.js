import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message } = body

  try {
    const response = await axios.post('http://ai.dhanyrpebs.cloud/api/generate', {
      model: 'milty',
      prompt: message,
      stream: true,
    })

    return response.data
  } catch (error) {
    return {
      error: 'Something went wrong',
      details: error.response?.data || error.message,
    }
  }
})
