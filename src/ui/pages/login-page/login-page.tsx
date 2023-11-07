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
import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  addQueryParamsToPath,
  Button,
  ContentAlert,
  Field,
  Fields,
  Form,
  Formik,
  Tooltip,
} from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";
import {
  API,
  LoginPayload,
  RegistrationPayload,
  ChangePasswordPayload,
} from "../../modules/auth/user-authentication";

import { LoginLayout } from "layouts";
import { TOKEN_KEY } from "common/constants";
import { getCustomPath } from "common";
import { Tab, Tabs } from "components/tabs";

const AuthFormStyle = styled(Form)`
  ${tw`flex flex-col gap-y-6 mt-6 w-88`}
  & > * {
    ${tw`h-10`}
  }
`;

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const resetState = () => {
    setError("");
    setSuccess("");
  };
  const { push } = useHistory();
  useLayoutEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      push(
        addQueryParamsToPath({ activeModal: "analityc" }, `${getCustomPath()}/`)
      );
    }
  }, []);

  return (
    <LoginLayout>
      <div tw="flex flex-col h-full">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div tw="text-32 leading-40 text-monochrome-black">
            Welcome to Drill4J
          </div>
          <Tabs onChange={resetState}>
            <Tab title="Sign in">
              {signInForm(setSuccess, setError, resetState)}
            </Tab>
            <Tab title="Sign up">
              {signUpForm(setSuccess, setError, resetState)}
            </Tab>
            <Tab title="Forgot password">
              <div tw="mt-2 px-16 text-16 leading-24 text-monochrome-default text-center">
                Please contact Drill4J instance administrator to request
                password reset
              </div>
            </Tab>
          </Tabs>
          {error && <ContentAlert type="ERROR">{`${error}`}</ContentAlert>}
          {success && (
            <ContentAlert type="SUCCESS">{`${success}`}</ContentAlert>
          )}
        </div>
        <div tw="mb-6 font-regular text-12 leading-24 text-monochrome-default text-center">
          {`© ${new Date().getFullYear()} Drill4J. All rights reserved.`}
        </div>
      </div>
    </LoginLayout>
  );
};

function updatePasswordForm(onError: (error: any) => any) {
  async function handleUpdatePassword(payload: ChangePasswordPayload) {
    try {
      await API.updatePassword(payload);
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div>
      <div tw="mt-2 px-16 text-16 leading-24 text-monochrome-default text-center">
        Update password
      </div>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
        }}
        onSubmit={handleUpdatePassword as any}
      >
        <AuthFormStyle>
          <Field
            name="oldPassword"
            type="password"
            component={Fields.Input}
            placeholder="Old password"
          />
          <Field
            name="newPassword"
            type="password"
            component={Fields.Input}
            placeholder="New password"
          />
          <Button
            tw="flex justify-center w-full"
            primary
            size="large"
            type="submit"
          >
            Update password
          </Button>
        </AuthFormStyle>
      </Formik>
    </div>
  );
}

function signUpForm(
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
            placeholder="Username"
          />
          <Field
            name="password"
            type="password"
            component={Fields.Input}
            placeholder="Password"
          />
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

function signInForm(
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
            placeholder="Username"
          />
          <Field
            name="password"
            type="password"
            component={Fields.Input}
            placeholder="Password"
          />
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
