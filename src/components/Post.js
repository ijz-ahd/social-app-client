import React, { useContext } from "react";
import { Card, Image, Button, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

function Post({
  post: { id, username, body, createdAt, likes, likesCount, commentsCount },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid style={{ marginBottom: "30px" }} className="postCard">
      <Card.Content>
        <Image
          floated="left"
          circular={true}
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
        />
        <Card.Header style={{ backgroundColor: "transparent", color: "#333" }}>
          {username}
        </Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description
          style={{
            marginTop: "20px",
            fontSize: "16px",
            backgroundColor: "transparent",
          }}
        >
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likesCount, likes }} />
        <Button as="div" labelPosition="right" size="mini">
          <Button
            color="grey"
            basic
            style={{ fontWeight: "700" }}
            size="mini"
            as={Link}
            to={`/posts/${id}`}
          >
            Comment
          </Button>
          <Label as="a" basic color="grey" pointing="left">
            {commentsCount}
          </Label>
        </Button>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default Post;
