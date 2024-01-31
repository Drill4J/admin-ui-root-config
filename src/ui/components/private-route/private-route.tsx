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

import { getPagePath } from "common";
import useUserInfo from "modules/auth/hooks/use-user-info";
import { Spinner } from "@drill4j/ui-kit";
import { Role } from "modules/auth/models";
import { HttpStatusError } from "modules/auth/hooks/types";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { component, ...rest } = props;
  const Component = component;

  const { data, httpStatusError, isLoading } = useUserInfo();
  if (isLoading) {
    return <Spinner color="blue" />;
  }

  // handle edgecase when user role has been changed to UNDEFINED after page loaded
  // TODO doesn't work as intended since Admin Backend does not reflect role changes in /user-info
  //   unless user sings out - signs in
  if (data?.role === Role.UNDEFINED
    // 401 / 403 are already handled by interceptor in configureAxios but we might change that
    || httpStatusError === HttpStatusError.Unauthorized
    || httpStatusError === HttpStatusError.Forbidden) {
    return <Redirect to={{ pathname: getPagePath({ name: "login" }) }} />;
  }

  return (
    <Route
      render={() => <Component {...props} />}
      {...rest}
    />
  );
}
