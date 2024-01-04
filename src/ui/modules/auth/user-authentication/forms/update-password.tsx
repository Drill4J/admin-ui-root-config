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
import tw, { styled } from "twin.macro";
import {
  Button, Field, Fields, Formik, Form,
} from "@drill4j/ui-kit";
import { API, ChangePasswordPayload } from "..";

type NewPasswordRepeat = {
  newPasswordRepeat: string;
};

export function updatePasswordForm(
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  resetState: () => void,
) {
  async function handleUpdatePassword(
    payload: ChangePasswordPayload & NewPasswordRepeat,
  ) {
    try {
      if (payload.newPasswordRepeat !== payload.newPassword) throw new Error("Repeated password does not match new password");

      const result = await API.updatePassword({
        newPassword: payload.newPassword,
        oldPassword: payload.oldPassword,
      });
      await navigator.clipboard.writeText(payload.newPassword)
      setSuccess(result);
    } catch (e) {
      setError(e);
    }
  }

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      }}
      onSubmit={(data: any) => {
        resetState();
        handleUpdatePassword(data);
      }}
    >
      <AuthFormStyle>
        <Label>
          Enter old password:
          <Field
            id="oldPassword"
            name="oldPassword"
            type="password"
            component={Fields.Input}
            placeholder="Old password"
          />
        </Label>
        <Label>
          Enter new password:
          <Field
            name="newPassword"
            type="password"
            component={Fields.Input}
            placeholder="New password"
          />
        </Label>
        <Label>
          Enter new password again:
          <Field
            name="newPasswordRepeat"
            type="password"
            component={Fields.Input}
            placeholder="Repeat new password"
          />
        </Label>
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
