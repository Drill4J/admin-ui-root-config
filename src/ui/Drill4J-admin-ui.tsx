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
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary: (err, info, props) => (
    <ul>
      <li>err: {err}</li>
      <li>info: {info}</li>
      <li>props: {props}</li>
    </ul>
  ),
  domElementGetter: () => document.querySelector("main") || document.body,
});
