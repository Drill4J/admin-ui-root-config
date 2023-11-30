import React from "react";
import {
  Button, Field,
  Fields, Formik
} from "@drill4j/ui-kit";
import {
  API,
  LoginPayload
} from "..";
import { AuthFormStyle } from "./style";

export function signInForm(
  setSuccess: Function,
  setError: Function,
  resetState: Function
) {
  async function handleLogin(payload: LoginPayload) {
    try {
      const result = await API.signIn(payload);
      setSuccess(result);
      window.location.reload();
    } catch (e) {
      setError(e);
    }
  }

  return (
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(data: any) => {
          resetState();
          handleLogin(data);
        }}
      >
        <AuthFormStyle>
          <Field
            name="username"
            component={Fields.Input}
            placeholder="Username" />
          <Field
            name="password"
            type="password"
            component={Fields.Input}
            placeholder="Password" />
          <Button
            tw="w-full justify-center"
            primary
            size="large"
            type="submit"
          >
            Sign in
          </Button>
        </AuthFormStyle>
      </Formik>
  );
}
