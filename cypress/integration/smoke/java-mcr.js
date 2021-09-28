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
/// <reference types="cypress" />
import { JAVA_GROUP_NAME } from "../../fixtures/constants";

context("Java mcr smoke", () => {
  before(() => {
    cy.task("removeContainers");
    cy.task("startAdmin");
    cy.wait(30000);
    cy.task("startPetclinicMcr", { build: "0.1.0" });
    cy.wait(15000);
  });

  it("should display unregistered group", () => {
    cy.get("table")
      .get("tr")
      .get('a[data-test="name-column"]')
      .then(($link) => {
        expect($link.text()).to.eq(JAVA_GROUP_NAME);
        expect($link.attr("disabled")).to.eq("disabled");
      });
    cy.get("table")
      .get("tr")
      .get('[data-test="td-row-cell-status"]')
      .get("input[type=checkbox]")
      .should("have.value", "false");
  });
});
