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
    <div>
      <div tw="mt-2 px-16 text-16 leading-24 text-monochrome-default text-center">
        Provide your credentials
      </div>
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
            tw="flex justify-center w-full"
            primary
            size="large"
            type="submit"
          >
            Sign in
          </Button>
        </AuthFormStyle>
      </Formik>
    </div>
  );
}
