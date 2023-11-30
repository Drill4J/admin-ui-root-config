import React from "react";
import {
  Button, Field,
  Fields, Formik
} from "@drill4j/ui-kit";
import { API, RegistrationPayload } from "..";
import { AuthFormStyle } from "./style";

export function signUpForm(
  setSuccess: Function,
  setError: Function,
  resetState: Function
) {
  async function handleSignUp(payload: RegistrationPayload) {
    try {
      const result = await API.signUp(payload);
      setSuccess(result);
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(data: any) => {
          resetState();
          handleSignUp(data);
        }}
      >
        <AuthFormStyle>
          <Field
            name="username"
            component={Fields.Input}
            placeholder="Enter new username" />
          <Field
            name="password"
            type="password"
            component={Fields.Input}
            placeholder="Enter password" />
          <Button
            primary
            size="large"
            type="submit"
          >
            Sign up
          </Button>
        </AuthFormStyle>
      </Formik>
    </div>
  );
}
