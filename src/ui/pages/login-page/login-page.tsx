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
  ContentAlert,
  Form,
  Tooltip,
} from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { LoginLayout } from "layouts";
import { TOKEN_KEY } from "common/constants";
import { getCustomPath } from "common";
import { Tab, Tabs } from "components/tabs";
import { signUpForm } from "../../modules/auth/user-authentication/forms/sign-up";
import { signInForm } from "../../modules/auth/user-authentication/forms/sign-in";

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


