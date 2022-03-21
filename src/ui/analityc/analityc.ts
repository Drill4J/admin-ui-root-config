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
import ReactGA from "react-ga";

// eslint-disable-next-line no-shadow
export enum EVENT_NAMES {
  CLICK_TO_REGISTER_BUTTON = 'Click on button "Register"',
  CLICK_TO_FINISH_REGISTER_BUTTON = 'Click on button "Finish"',
  EDIT_PROJECT_PACKAGES = 'Click on button "Save changes" to edit project package(s)',
}

interface EventProps {
  name: EVENT_NAMES,
  label?: string,
}

export const sendAgentEvent = ({ name, label }: EventProps) => {
  ReactGA.set({ dimension3: Date.now() });
  ReactGA.event({
    action: name,
    category: "Plugin",
    label,
  });
};
