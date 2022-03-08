import React, { useEffect, useState, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Table, Space, Input } from 'antd';
import axios from 'axios'

import { DeletePostBtn } from './DeletePostBtn'

export const Posts = () => {
  const defaultState = useMemo(()=>({
    data: [],
    meta: {
      total: 0,
      currentPage: 1,
      pages: 1,
      perPage: 12,
    },
    error: undefined,
    loading: true
  }), [])

  const history = useHistory()

  const [posts, setPosts] = useState(defaultState)
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = new URLSearchParams(history.location.search);

        const page = parseInt(q.get('page')) || 1

        const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${posts.meta.perPage}&_embed=comments&_expand=user`
        const response = await axios.get(url)

        const total = response.headers?.['x-total-count'] || 0

        setPosts(prState => ({
          ...prState,
            meta:{
              ...prState.meta,
              total: parseInt(total),
              currentPage: page,
            },
            data: response.data,
            error: response.status !== 200,
            loading: false
        }))
      } catch (error) {
        setPosts(prState => ({
          ...prState,
            error,
            loading: false
        }))
      }
    }
    
    fetchPosts()

    return () => {
      setPosts(defaultState)
    }
  }, [defaultState, posts.meta.perPage, history.location.search])

  const handlePaginate = currentPage => {
    const q = new URLSearchParams({
      page: currentPage
    }).toString()

    history.push({ search: q })
  }

  const handleDeletePost = postId => {
    setPosts(prState => ({
      ...prState,
        meta:{
          ...prState.meta,
          total: prState.meta.total - 1,
          currentPage: prState.meta.page,
        },
        data: [
          ...prState.data.filter(({id}) => id !== postId),
        ],
    }))
  }

  const handleFilterByUser = async ({ target: { value } }) => {
    const url = `https://jsonplaceholder.typicode.com/posts?_embed=comments&_expand=user&users.username=${value}`
    const response = await axios.get(url)

    if(response.status !== 200) return
  }

  if(posts.loading) return <p>Loading...</p> 

  if(posts.error) return <p>Somthing went wrong!</p> 

  return (
    <Table 
      rowKey='id'
      dataSource={posts.data} 
      columns={[
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: () => (
            <Space size="middle">
              User
              <Input placeholder="Filter" onKeyPress={handleFilterByUser} />
            </Space>
          ),
          dataIndex: 'user',
          key: 'user',
          render: ({ name }) => name
        },
        {
          title: 'Comments count',
          dataIndex: 'comments',
          key: 'comments_count',
          render: comments => comments.length,
        },
        {
          title: 'Action',
          key: 'action',
          render: ({ id }) => (
            <Space size="middle">
              <Link to={`/posts/${id}`}>View</Link>
              <DeletePostBtn id={id} handleDeletePost={handleDeletePost} />
            </Space>
          )
        },
      ]}
      pagination={{
        showSizeChanger: false,
        defaultCurrent: posts.meta.currentPage, 
        total: posts.meta.total,
        pageSize: posts.meta.perPage,
        onChange: handlePaginate
      }}
    />
  )
}