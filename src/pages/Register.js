import { useMutation } from "@apollo/react-hooks";
import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../utils/useForm";
import { AuthContext } from "../context/authContext";
import gql from "graphql-tag";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onchange, handleSubmit, values } = useForm(callback, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function callback() {
    addUser();
  }

  return (
    <div className="formContainer">
      <h3 className="formHeader">Get a social account!</h3>
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
          label="Email"
          placeholder="Enter your email"
          name="email"
          value={values.email}
          onChange={onchange}
          error={errors.email ? true : false}
          type="email"
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
        <Form.Input
          label="Confirm Password"
          placeholder="Enter password again"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onchange}
          error={errors.confirmPassword ? true : false}
          type="password"
        />

        <Button type="Submit" primary fluid>
          Sign up
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
      {/* <Divider horizontal>Or</Divider>
      <div>
        <Button color="facebook">Facebook</Button>
        <Button color="google plus">Google Plus</Button>
      </div> */}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
