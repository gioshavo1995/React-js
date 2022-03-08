import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Card, List, Typography } from 'antd';
import axios from 'axios'

import { CreateComment } from './CreateComment'

export const PostView = () => {
  const defaultState = useMemo(() => ({
    data: {},
    error: undefined,
    loading: true
  }), [])

  const { id } = useParams()

  const [post, setPost] = useState(defaultState)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const url = `https://jsonplaceholder.typicode.com/posts/${id}?_embed=comments&_expand=user`
        const response = await axios.get(url)

        console.log(response)
        setPost(prState => ({
          ...prState,
            data: response.data,
            error: response.status !== 200,
            loading: false
        }))
      } catch (error) {
        setPost(prState => ({
          ...prState,
            error,
            loading: false
        }))
      }
    }
    
    fetchPost()

    return () => {
      setPost(defaultState)
    }
  }, [defaultState, id])

  const handleCreateComment = ({name, email, body}) => {
    setPost(prState => ({
      ...prState,
     data: {
      ...prState.data,
      comments: [
        ...prState.data.comments,
        { name, email, body }
      ]
     }
    }))
  }

  if(post.loading) return <p>Loading...</p> 

  if(post.error) return <p>Somthing went wrong!</p> 

  return (
    <div className="site-card-border-less-wrapper">
      <Card title={`ID: ${post.data.id} - ${post.data.title}`} bordered style={{ width: '100%' }}>
        <p>{post.data.body}</p>
        <p><b>User:</b> {post.data.user.name}</p>
        <List
          header={<p>Comments</p>}
          bordered
          dataSource={post.data.comments}
          renderItem={({email, name, body}) => (
            <List.Item>
              {email}:  
              <Typography.Text mark>{name}</Typography.Text> <br />
              {body}
            </List.Item>
          )}
        />
        <br />
        <CreateComment id={id} handleCreateComment={handleCreateComment} />
      </Card>
    </div>
  )
}