/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import "twin.macro";
import {
  Button, Field,
  Fields, Formik,
} from "@drill4j/ui-kit";
import {
  API,
  LoginPayload,
} from "..";
import { AuthFormStyle } from "./style";

export function signInForm(
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  resetState: () => void,
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
          placeholder="Username"
        />
        <Field
          name="password"
          type="password"
          component={Fields.Input}
          placeholder="Password"
        />
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
