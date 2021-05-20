import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  query getPosts {
    getPosts {
      id
      body
      createdAt
      username
      likesCount
      likes {
        username
      }
      commentsCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
