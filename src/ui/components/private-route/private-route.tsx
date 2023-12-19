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
import { RouteProps, Route, Redirect } from "react-router-dom";

import { TOKEN_KEY } from "common/constants";
import { getPagePath } from "common";
import useUserInfo from "modules/auth/hooks/use-user-info";
import { Spinner } from "@drill4j/ui-kit";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export function isAuth() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { component, ...rest } = props;
  const Component = component;

  const { data, errorMessage, isError, isLoading } = useUserInfo()

  if (isLoading) {
    return <Spinner color="blue"/>
  }

  // WRONG - will redirect even on 5xx, not just on 4xx
  if (isError) {
    return <Redirect to={{ pathname: getPagePath({ name: "login" }) }} />
  }

  return (
    <Route
      render={() => <Component {...props} />}
      {...rest}
    />
  );
}
