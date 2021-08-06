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
import React, {
  Children, ComponentType, ReactElement, useReducer, Component, useState, useEffect,
} from "react";
import { Formik, Form } from "formik";
import {
  Icons, Button, Spinner,
} from "@drill4j/ui-kit";
import { formatPackages } from "@drill4j/common-utils";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import "twin.macro";

import { Agent } from "types/agent";
import { useAdminConnection } from "hooks";
import { Plugin } from "types";
import {
  wizardReducer, previousStep, nextStep, state,
} from "./wizard-reducer";

export interface StepProps {
  name: string;
  component: ComponentType<any>;
  validate?: any;
}

interface Props {
  initialValues: Agent;
  onSubmit: (val: Record<string, unknown>) => Promise<void>;
  children: ReactElement<StepProps>[];
  onSuccessMessage: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Step = (props: StepProps) => null;

export const Wizard = ({
  children, initialValues, onSubmit, onSuccessMessage,
}: Props) => {
  const [{ currentStepIndex }, dispatch] = useReducer(wizardReducer, state);
  const steps = Children.toArray(children);
  const { name, validate, component: StepComponent } = (steps[currentStepIndex] as Component<StepProps>).props;
  const availablePlugins = useAdminConnection<Plugin[]>("/plugins") || [];
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      <Formik
        initialValues={{
          ...initialValues,
          availablePlugins,
          systemSettings: {
            ...initialValues.systemSettings,
            packages: formatPackages(initialValues.systemSettings?.packages),
          },
          plugins: availablePlugins.length === 1 ? [availablePlugins[0].id] : [],
        }}
        enableReinitialize
        onSubmit={async (values: any) => {
          try {
            setIsSubmitting(true);
            await onSubmit(values);
            setIsSubmitting(false);
            sendNotificationEvent({ type: "SUCCESS", text: onSuccessMessage });
          } catch ({ response: { data: { message } = {} } = {} }) {
            sendNotificationEvent({
              type: "ERROR",
              text: message || "On-submit error. Server problem or operation could not be processed in real-time.",
            });
          }
        }}
        validate={validate}
        validateOnMount
      >
        {({
          isValid,
          values,
          validateForm,
        }) => {
          useEffect(() => {
            values?.id && validateForm();
          }, [validate]);

          return (
            <Form>
              <div className="flex items-center w-full px-6 py-4">
                <span tw="w-full text-20 leading-32 text-monochrome-black">
                  {`${currentStepIndex + 1} of ${Children.count(children)}. ${name} `}
                </span>
                <div className="flex justify-end items-center w-full">
                  {currentStepIndex > 0 && (
                    <Button
                      tw="flex gap-x-2 mr-4"
                      secondary
                      size="large"
                      onClick={() => dispatch(previousStep())}
                      data-test="wizard:previous-button"
                      type="button"
                    >
                      <Icons.Expander width={8} height={14} rotate={180} />
                      <span>Back</span>
                    </Button>
                  )}
                  {currentStepIndex < steps.length - 1 ? (
                    <Button
                      className="flex gap-x-2"
                      tw="w-28"
                      primary
                      size="large"
                      onClick={() => dispatch(nextStep())}
                      disabled={isSubmitting || !isValid}
                      data-test="wizard:continue-button"
                      type="button"
                    >
                      Continue
                      <Icons.Expander tw="text-monochrome-white" width={8} height={14} />
                    </Button>
                  ) : (
                    <Button
                      tw="w-28"
                      className="flex gap-x-2"
                      primary
                      size="large"
                      type="submit"
                      data-test="wizard:finishng-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Spinner disabled /> : <Icons.Check height={10} width={14} viewBox="0 0 14 10" />}
                      <span>Finish</span>
                    </Button>
                  )}
                </div>
              </div>
              <StepComponent formValues={values} />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
