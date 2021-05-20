import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
  Dimmer,
  Loader,
  Image,
  Segment,
  Grid,
  Card,
  Button,
  Label,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/authContext";
import DeleteButton from "../components/DeleteButton";

function PostPage(props) {
  const { user } = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const commentRef = useRef(null);

  const postId = props.match.params.postId;

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  let post;
  if (data) {
    post = data.getPost;
  }

  const [postComment] = useMutation(COMMENT_MUTATION, {
    update() {
      setComment("");
      commentRef.input.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const deletePost = () => {
    props.history.push("/");
  };

  let postMarkup;
  if (!post) {
    postMarkup = (
      <Segment>
        <Dimmer active inverted>
          <Loader size="large" style={{ backgroundColor: "transparent" }}>
            Loading
          </Loader>
        </Dimmer>

        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
      </Segment>
    );
  } else {
    const {
      id,
      username,
      body,
      createdAt,
      likes,
      likesCount,
      comments,
      commentsCount,
    } = post;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              size="small"
              rounded
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likesCount }} />
                <Button as="div" labelPosition="right" size="mini">
                  <Button basic color="grey" size="mini">
                    Comment
                  </Button>
                  <Label basic color="grey" pointing="left">
                    {commentsCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePost} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Post a comment"
                        name="comment"
                        value={comment}
                        autoComplete="off"
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentRef}
                      />
                      <button
                        className="ui button blue"
                        disabled={comment.trim() === ""}
                        onClick={postComment}
                        type="submit"
                      >
                        Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      createdAt
      likesCount
      likes {
        username
      }
      commentsCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

const COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentsCount
    }
  }
`;

export default PostPage;
