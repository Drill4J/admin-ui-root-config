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
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import tw, { styled } from "twin.macro";
import {
  addQueryParamsToPath,
  Button,
  ContentAlert,
  Spinner,
} from "@drill4j/ui-kit";

import { LoginLayout } from "layouts";
import { TOKEN_KEY } from "common/constants";
import { getCustomPath } from "common";
import { Tab, Tabs } from "components/tabs";
import { signUpForm } from "../../modules/auth/user-authentication/forms/sign-up";
import { signInForm } from "../../modules/auth/user-authentication/forms/sign-in";
import useUiConfig from "modules/auth/hooks/use-ui-config";
import { navigateToOAuthLoginPage } from "modules/auth/user-authentication/utils";

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const resetState = () => {
    setError("");
    setSuccess("");
  };

  const foo = useUiConfig();
  const {
    data: uiConfig,
    isError: isUiConfigError,
    errorMessage: uiConfigErrorMessage,
    isLoading: isUiConfigLoading,
  } = foo
  const { push } = useHistory();
  useLayoutEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      push(
        addQueryParamsToPath({ activeModal: "analityc" }, `${getCustomPath()}/`)
      );
    }
  }, []);

  if (!uiConfig?.simpleAuth?.enabled && uiConfig?.oauth2?.automaticSignIn) {
    navigateToOAuthLoginPage();
  }

  return (
    <LoginLayout>
      <div tw="flex flex-col h-full">
        <div tw="px-5" className="flex flex-col justify-center items-center w-full h-full">
          <div tw="text-32 leading-40 text-monochrome-black">
            Welcome to Drill4J
          </div>
          {isUiConfigLoading ? (
            <>
              <Text>Loading authentication information...</Text>
              <Spinner tw="mt-5" color="blue"/>
            </>
          ) : (
            <>
              {uiConfig?.simpleAuth?.enabled && (
                <Tabs onChange={resetState}>
                  <Tab title="Sign in">
                    {signInForm(setSuccess, setError, resetState)}
                  </Tab>
                  <Tab title="Sign up">
                    {uiConfig?.simpleAuth?.signUpEnabled ? (
                      signUpForm(setSuccess, setError, resetState)
                    ) : (
                      <Text>
                        Sign up is disabled. Please
                        {uiConfig?.oauth2?.enabled && (
                          <>
                            {" "}
                            use "{uiConfig?.oauth2?.buttonTitle}" authentication
                            method or{" "}
                          </>
                        )}
                        contact Drill4J instance Administrator
                      </Text>
                    )}
                  </Tab>
                  <Tab title="Forgot password">
                    <Text>
                      Please contact Drill4J instance administrator to request
                      password reset
                    </Text>
                  </Tab>
                </Tabs>
              )}
              { uiConfig?.oauth2?.enabled && uiConfig?.simpleAuth?.enabled && 
                <div tw="w-full mt-2 text-monochrome-gray text-center">or</div>
              }
              {uiConfig?.oauth2?.enabled && (
                <Button
                  tw="mt-5 w-full"
                  secondary
                  size="large"
                  type="submit"
                  onClick={() => navigateToOAuthLoginPage()}
                >
                  {uiConfig?.oauth2?.buttonTitle}
                </Button>
              )}
            </>
          )}
          {(uiConfigErrorMessage || error) && <ContentAlert type="ERROR">{`${uiConfigErrorMessage || error}`}</ContentAlert>}
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

const Text = styled.div`
  ${tw`mt-2 px-2 text-16 leading-24 text-monochrome-default text-center`}
`;
