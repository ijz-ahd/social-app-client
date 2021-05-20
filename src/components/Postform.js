import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button, Image } from "semantic-ui-react";
import { useForm } from "../utils/useForm";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function Postform() {
  const { values, onchange, handleSubmit } = useForm(callback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      // fetching from graphl client cache (newest first)
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError() {
      if (error) {
        console.log(error);
      }
    },
  });

  function callback() {
    createPost();
  }

  return (
    <>
      <Form className="postFormContainer" onSubmit={handleSubmit}>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          size="mini"
          circular
        />
        <Form.Field
          style={{
            display: "flex",
            marginTop: "10px",
          }}
        >
          <Form.Input
            placeholder="Say something!"
            name="body"
            onChange={onchange}
            value={values.body}
            style={{ width: "320px" }}
            type="text"
            error={error ? true : false}
            autoComplete="off"
          />
          <Button
            type="submit"
            color="blue"
            style={{
              height: "fit-content",
              marginLeft: "10px",
            }}
          >
            Post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likesCount
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;

export default Postform;
