import React, { useState } from 'react';
import { Button } from 'antd';
import axios from 'axios'

export const DeletePostBtn = ({ id, handleDeletePost }) => {
  const [loading, setLoading] = useState(false)

  const handleDeleteBtn = async () => {
    try {
      setLoading(true)

      const url = `https://jsonplaceholder.typicode.com/posts/${id}`
      const response = await axios.delete(url)

      setLoading(false)
  
      if(response.status !== 200) return
      
      handleDeletePost(id)
    } catch (error) {
      console.error(error)
    }
  }

  return <Button disabled={loading} onClick={handleDeleteBtn}>Delete</Button>
}