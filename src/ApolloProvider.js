import React from "react";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import App from "./App";

// pointing backend apollo server
const httpLink = createHttpLink({
  uri: "https://sheltered-basin-44056.herokuapp.com/",
});

// automatically adds auth token on each request if exist
const authLink = setContext(() => {
  const token = localStorage.getItem("access-token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// configs for client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// apollo wrapper for component
export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
