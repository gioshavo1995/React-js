import React, {useState} from 'react';
import {
  Form,
  Input,
  Button,
} from 'antd';
import axios from 'axios'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export const CreateComment = ({ id, handleCreateComment }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false)

  const handleForm = async ({name, email, body}) => {
    try {
      setLoading(true)

      const url = `https://jsonplaceholder.typicode.com/posts/${id}/comments`
      const response = await axios.post(url, {
        body: JSON.stringify({name, email, body})
      })

      setLoading(false)
  
      if(response.status !== 201) return
      
      form.resetFields()

      handleCreateComment({name, email, body})
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="comment"
      onFinish={handleForm}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input your Name', whitespace: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="body"
        label="Body"
        rules={[{ required: true, message: 'Please input Body' }]}
      >
        <Input.TextArea showCount maxLength={100} />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" disabled={loading}>
          Comment
        </Button>
      </Form.Item>
    </Form>
  );
};
