import React from "react";
import { API, ChangePasswordPayload } from "..";
import { Button, Field, Fields, Formik, Form } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

type NewPasswordRepeat = {
  newPasswordRepeat: string;
};

export function updatePasswordForm(
  setSuccess: Function,
  setError: Function,
  resetState: Function
) {
  async function handleUpdatePassword(
    payload: ChangePasswordPayload & NewPasswordRepeat
  ) {
    try {
      if (payload.newPasswordRepeat !== payload.newPassword)
        throw new Error("Repeated password does not match new password");

      const result = await API.updatePassword({
        newPassword: payload.newPassword,
        oldPassword: payload.oldPassword,
      });
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
  ${tw`flex flex-col gap-y-6 w-88`}
  row-gap: 3rem;
  & > * {
    height: 2rem;
  }
`;