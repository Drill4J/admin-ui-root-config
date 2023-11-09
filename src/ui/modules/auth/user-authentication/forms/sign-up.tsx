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
      <div tw="mt-2 px-16 text-16 leading-24 text-monochrome-default text-center">
        Register new user
      </div>
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
            Sign up
          </Button>
        </AuthFormStyle>
      </Formik>
    </div>
  );
}
