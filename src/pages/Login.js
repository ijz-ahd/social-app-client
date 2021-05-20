import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../utils/useForm";
import { AuthContext } from "../context/authContext";
import gql from "graphql-tag";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onchange, handleSubmit, values } = useForm(callback, {
    username: "",
    password: "",
  });

  const [authUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function callback() {
    authUser();
  }

  return (
    <div className="formContainer">
      <h3 className="formHeader">Sign in to your social!</h3>
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <Form.Input
          label="Username"
          placeholder="Enter your user id"
          name="username"
          value={values.username}
          onChange={onchange}
          error={errors.username ? true : false}
          type="text"
        />

        <Form.Input
          label="Password"
          placeholder="Enter your password"
          name="password"
          value={values.password}
          onChange={onchange}
          error={errors.password ? true : false}
          type="password"
        />

        <Button type="Submit" primary fluid>
          Sign in
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
