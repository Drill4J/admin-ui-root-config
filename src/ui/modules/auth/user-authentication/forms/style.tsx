import { Form } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

export const AuthFormStyle = styled(Form)`
  ${tw`flex flex-col gap-y-6 mt-6 w-88`}
  & > * {
    ${tw`h-10`}
  }
`;
