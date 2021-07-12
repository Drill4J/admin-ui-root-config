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
import { createGlobalStyle } from "styled-components";

import OpenSansRegular from "./fonts/OpenSans-Regular.woff2";
import OpenSansLight from "./fonts/OpenSans-Light.woff2";
import OpenSansBold from "./fonts/OpenSans-Bold.woff2";
import OpenSansSemibold from "./fonts/OpenSans-SemiBold.woff2";

export const FontsStyles = createGlobalStyle`
  @font-face {
  font-family: 'OpenSans';
  src: url('${OpenSansRegular}') format('truetype');
  font-weight: normal;
  font-style: normal;
  }

  @font-face {
    font-family: 'OpenSans-Light';
    src: url('${OpenSansLight}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'OpenSans-Semibold';
    src: url('${OpenSansSemibold}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'OpenSans-Bold';
    src: url('${OpenSansBold}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;
