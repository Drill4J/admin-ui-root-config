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
import React, { useEffect, useState } from "react";
import {
  Button, Form, Formik, FormValidator, Icons, sendAlertEvent,
} from "@drill4j/ui-kit";
import "twin.macro";

import { useSetPanelContext } from "components";
import { useSessionStorage } from "hooks";
import { Agent } from "types";
import { StepLabel } from "./step-label";
import { PanelWithCloseIcon } from "../../panel-with-close-icon";

interface Step {
  stepLabel: string;
  component: React.ReactNode;
  validationSchema: FormValidator;
}

interface Props {
  label: React.ReactNode;
  steps: Step[];
  initialValues?: Agent;
  onSubmit: (val: Record<string, unknown>) => Promise<void>;
  successMessage: string,
  isOpen?: any;
  setIsOpen?: any;
}

export const Stepper = ({
  label,
  steps,
  initialValues = {},
  onSubmit,
  successMessage,
  isOpen,
  setIsOpen,
}: Props) => {
  const setPanel = useSetPanelContext();
  const [stepNumber, setStepNumber] = useState(0);
  const isLastStep = steps.length - 1;
  const currentValidationSchema = steps[stepNumber].validationSchema;
  const currentStep = steps[stepNumber].component;

  const goToNextStep = () => setStepNumber((prevStepNumber) => (prevStepNumber !== isLastStep
    ? prevStepNumber + 1
    : prevStepNumber));

  const goToPrevStep = () => setStepNumber((prevStepNumber) => (prevStepNumber === 0
    ? prevStepNumber
    : prevStepNumber - 1));

  const goTo = (index: number) => setStepNumber((prevStepNumber) => {
    if (prevStepNumber > index) return index;
    if (index - prevStepNumber === 1) return prevStepNumber + 1;
    return prevStepNumber;
  });

  if (!initialValues) return null;

  const [state, setState] = useSessionStorage(initialValues?.id || "preregistered", initialValues);
  const returnToList = async (values: Agent) => {
    await setState(values);
    setPanel({ type: "SELECT_AGENT" });
  };

  return (
    <Formik
      initialValues={state}
      onSubmit={async (values: any) => {
        onSubmit(values).then(() => {
          sendAlertEvent({
            type: "SUCCESS",
            title: successMessage,
          });
        }).catch(() => {
          sendAlertEvent({
            type: "ERROR",
            title: "On-submit error. Server problem or operation could not be processed in real-time.",
          });
        });
        setPanel({ type: "SELECT_AGENT" });
      }}
      validate={currentValidationSchema as any}
      validateOnChange
    >
      {({
        isValid, values, validateForm,
      }) => {
        useEffect(() => {
          validateForm(values);
        }, [stepNumber]);

        useEffect(() => {
          setState(values);
        }, [values]);

        return (
          <Form autoComplete="off">
            <PanelWithCloseIcon
              isDisabledFade
              header={(
                <div tw="space-y-8 pt-6 pb-4 w-[976px]">
                  <div tw="flex justify-between">
                    {label}
                    <Button secondary size="large" type="button" onClick={() => returnToList(values)}>
                      Return to List
                    </Button>
                  </div>
                  <div tw="flex justify-center gap-8">
                    {steps.map(({ stepLabel }, index) => (
                      <div onClick={() => isValid && goTo(index)} key={stepLabel}>
                        <StepLabel
                          key={stepLabel}
                          isActive={index === stepNumber}
                          isCompleted={index < stepNumber}
                          stepNumber={index + 1}
                          stepLabel={stepLabel}
                          isValid={isValid}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              footer={(
                <div tw="flex gap-4 items-center justify-center w-full h-full">
                  {stepNumber > 0 && (
                    <Button
                      secondary
                      size="large"
                      type="button"
                      onClick={goToPrevStep}
                      data-test="wizard:previous-step"
                    >
                      <Icons.Expander width={7} height={12} rotate={180} />
                      Back
                    </Button>
                  )}
                  {stepNumber === isLastStep ? (
                    <Button
                      primary
                      key="finish"
                      size="large"
                      data-test="wizard:finish"
                      type="submit"
                      disabled={!isValid}
                    >
                      Finish
                    </Button>
                  ) : (
                    <Button
                      primary
                      key="next"
                      size="large"
                      type="button"
                      onClick={goToNextStep}
                      disabled={!isValid}
                      data-test="wizard:next-step"
                    >
                      Next
                      <Icons.Expander width={7} height={12} />
                    </Button>
                  )}
                </div>
              )}
              isOpen={isOpen}
              onClosePanel={() => setIsOpen(false)}
            >
              <div tw="flex w-full h-full py-16 justify-center">
                {currentStep}
              </div>
            </PanelWithCloseIcon>
          </Form>
        );
      }}
    </Formik>
  );
};
