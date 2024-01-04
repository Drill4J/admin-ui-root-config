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
import React, {useContext, useState} from "react";
import tw, {styled} from "twin.macro";
import {
  Button, Field, Fields, Formik, Form,
} from "@drill4j/ui-kit";
import {API, ExpiryPeriodEnum, GenerateApiKeyPayload} from "..";
import {RefreshContext} from "../tables/keys";
import {DarkDropdown} from "../../../../components";


export function generateApiKeyForm(
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  resetState: () => void,
) {
  const refreshData = useContext(RefreshContext);
  const [expiryPeriod, setExpiryPeriod] = useState<any>(ExpiryPeriodEnum.ONE_MONTH);

  async function handleGenerateApiKey(
    payload: GenerateApiKeyPayload
  ) {
    try {
      const result = await API.generateKey({
        description: payload.description,
        expiryPeriod: payload.expiryPeriod,
      });
      refreshData(Date.now().toString());
      await navigator.clipboard.writeText(result.data.apiKey)
      setSuccess(result.message);
    } catch (e) {
      setError(e);
    }
  }

  return (
    <Formik
      initialValues={{
        id: -1,
        description: "",
        expiryPeriod: ExpiryPeriodEnum.ONE_MONTH,
      }}
      onSubmit={(data: any) => {
        resetState();
        handleGenerateApiKey(data);
      }}
    >
      <AuthFormStyle>
        <Label>
          Enter description:
          <Field
            id="description"
            name="description"
            type="text"
            component={Fields.Input}
            placeholder="Description"
          />
        </Label>
        <Label>
          Choose Expiry Period:
          <DarkDropdown
            items={expiryPeriodType}
            onChange={(value => setExpiryPeriod(value))}
            value={expiryPeriod}
          />
        </Label>
        <Button
          tw="flex justify-center w-full"
          primary
          size="large"
          type="submit"
        >
          Generate
        </Button>
      </AuthFormStyle>
    </Formik>
  );
}

const Label = styled.label`
  ${tw`flex flex-col px-6 text-14 text-monochrome-gray p-0`}
`;

export const AuthFormStyle = styled(Form)`
  ${tw`flex flex-col gap-y-6`}
  row-gap: 3rem;

  & > * {
    height: 2rem;
  }
`;

const expiryPeriodType = [
  {
    value: ExpiryPeriodEnum.ONE_MONTH,
    label: "One month",
  },
  {
    value: ExpiryPeriodEnum.THREE_MONTHS,
    label: "Three Month",
  },
  {
    value: ExpiryPeriodEnum.SIX_MONTHS,
    label: "Six Months",
  },
  {
    value: ExpiryPeriodEnum.ONE_YEAR,
    label: "One Year",
  },
];
