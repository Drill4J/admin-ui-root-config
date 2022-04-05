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
import axios from "axios";
import {
  addQueryParamsToPath, Button, ContentAlert, Field, Fields, Form, Formik,
} from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { LoginLayout } from "layouts";
import { TOKEN_HEADER, TOKEN_KEY } from "common/constants";
import { getCustomPath } from "common";

const SignInForm = styled(Form)`
  ${tw`flex flex-col gap-y-6 mt-6 w-88`}
  & > * {
    ${tw`h-10`}
  }
`;

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { push } = useHistory();

  async function handleLogin(values?: { name: string, password: string }) {
    try {
      const response = await axios.post("/login", values);
      const authToken = response.headers[TOKEN_HEADER.toLowerCase()];
      if (authToken) {
        localStorage.setItem(TOKEN_KEY, authToken);
      }
      window.location.reload();
    } catch ({ response: { data: { message = "" } = {} } = {} }) {
      setError(
        message as string ||
          "There was some issue with an authentication. Please try again later.",
      );
    }
  }

  useLayoutEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      push(addQueryParamsToPath({ activeModal: "analityc" }, `${getCustomPath()}/`));
    }
  }, []);

  return (
    <LoginLayout>
      <div tw="flex flex-col h-full">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div tw="text-32 leading-40 text-monochrome-black">
            Welcome to Drill4J
          </div>
          <div tw="mt-2 px-16 text-16 leading-24 text-monochrome-default text-center">
            Click &quot;Continue as a guest&quot; to entry Admin Panel with
            admin privilege
          </div>
          {error && (
            <ContentAlert tw="mt-4 mx-1" type="ERROR">
              {`${error}`}
            </ContentAlert>
          )}
          <Formik
            initialValues={{
              name: "",
              password: "",
            }}
            onSubmit={handleLogin as any}
          >
            <SignInForm>
              <Field
                name="name"
                component={Fields.Input}
                placeholder="User ID"
              />
              <Field
                name="password"
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
              <div tw="font-bold text-14 leading-20 text-center text-blue-default opacity-25">
                Forgot your password?
              </div>
            </SignInForm>
          </Formik>
          <Button
            tw="flex justify-center w-88 mt-10 "
            secondary
            size="large"
            data-test="login-button:continue-as-guest"
            onClick={() => handleLogin()} // use to call without arguments
          >
            Continue as a guest (with admin rights)
          </Button>
        </div>
        <div tw="mb-6 font-regular text-12 leading-24 text-monochrome-default text-center">
          {`© ${new Date().getFullYear()} Drill4J. All rights reserved.`}
        </div>
      </div>
    </LoginLayout>
  );
};
