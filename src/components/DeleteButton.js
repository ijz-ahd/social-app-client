import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function DeleteButton({ postId, commentId, callback }) {
  const [confirm, setConfirm] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deleteMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirm(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== postId),
          },
        });
      }
      if (callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Button
        floated="right"
        onClick={() => setConfirm(true)}
        size="mini"
        style={{ backgroundColor: "#ff726f", color: "white" }}
      >
        Delete
      </Button>
      <Confirm
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={() => deleteMutation()}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentsCount
    }
  }
`;

export default DeleteButton;
