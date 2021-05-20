import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Popup } from "semantic-ui-react";

function LikeButton({ post: { id, likes, likesCount }, user }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost, { error }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError() {
      if (error) console.log(error);
    },
  });

  const likeButton = user ? (
    liked ? (
      <Button
        color="blue"
        style={{ fontWeight: "700" }}
        className="likeButton"
        size="mini"
      >
        Liked
      </Button>
    ) : (
      <Button
        color="blue"
        basic
        style={{ fontWeight: "700" }}
        className="likeButton"
        size="mini"
      >
        Like
      </Button>
    )
  ) : (
    <Button
      color="blue"
      basic
      style={{ fontWeight: "700" }}
      className="likeButton"
      size="mini"
      as={Link}
      to="/login"
    >
      Like
    </Button>
  );

  return (
    <Popup
      inverted
      style={{ color: "white" }}
      content={
        liked && likesCount > 0
          ? likesCount === 1
            ? "You liked this post"
            : `You and ${likesCount - 1} others liked this post`
          : likesCount < 1
          ? "Be the first to like this post"
          : `${likesCount} liked this post`
      }
      trigger={
        <Button as="div" labelPosition="right" size="mini" onClick={likePost}>
          {likeButton}
          <Label as="a" basic color="blue" pointing="left">
            {likesCount}
          </Label>
        </Button>
      }
    />
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likesCount
    }
  }
`;

export default LikeButton;
