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

import { AGENT_NAME } from "../../fixtures/constants";
import { checkSystemMessage, convertUrl } from "../../utils";

context("Java agent smoke", () => {
  before(() => {
    cy.task("removeContainers");
    cy.task("startAdmin");
    cy.task("startPetclinic", { build: "0.1.0" });
    cy.wait(15000);
  });

  beforeEach(() => {
    cy.visit(convertUrl("/login"));
    cy.get('button[data-test="login-page:login-button"]').click();
  });

  it("should display unregistered agent", () => {
    cy.get("table")
      .get("tr")
      .get('a[data-test="name-column"]')
      .then(($link) => {
        expect($link.text()).to.eq(AGENT_NAME);
        expect($link.attr("disabled")).to.eq("disabled");
      });
    cy.get("table")
      .get("tr")
      .get('[data-test="td-row-cell-status"]')
      .get("input[type=checkbox]")
      .should("have.value", "false");
  });

  it("Register Java agent with only required parameters", () => {
    cy.get('[data-test="action-column:icons-register"]').click();
    cy.url().then((url) => {
      expect(url).to.eq(convertUrl(`/agents/${AGENT_NAME}/registration`));
    });
    cy.get("input[name=id]").should("have.value", AGENT_NAME);
    cy.get("input[name=name]").should("have.value", AGENT_NAME);

    cy.get('[data-test="wizard:continue-button"]').click();
    cy.get('[data-test="wizard:continue-button"]').click();

    cy.intercept("PATCH", `/api/agents/${AGENT_NAME}`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.equal(200);
      });
    }).as("registerAgent");
    cy.get('[data-test="wizard:finishng-button"]').click();
    cy.wait("@registerAgent");
  });

  it("Check the coverage percentage when only one test session is finished", () => {
    cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
    cy.get('[data-test="sidebar:link:Test2Code"]').click();

    cy.get('[data-test="active-build-coverage-info:build-coverage-percentage"]').should("have.text", "0%");
    cy.get('[data-test="active-scope-info:scope-coverage"]').should("have.text", "0%");
    cy.task("startPetclinicAutoTests", {}, { timeout: 200000 });
    cy.get('[data-test="active-scope-info:scope-coverage"]').should("not.have.text", "0%");

    cy.get('[data-test="active-scope-info:finish-scope-button"]').click();
    cy.get('[data-test="finish-scope-modal:scope-summary:code-coverage"]').should("not.have.text", "0%");
    cy.get('[data-test="finish-scope-modal:scope-summary:tests-count"]').should("not.have.text", 0);
    cy.get('[data-test="finish-scope-modal:finish-scope-button"]').click();
    cy.get('[data-test="message-panel:text"]').should("have.text", "Scope has been finished");

    cy.get('[data-test="active-build-coverage-info:build-coverage-percentage"]').should("not.have.text", "0%");
    cy.get('[data-test="active-scope-info:scope-coverage"]').should("have.text", "0%");
  });

  context("Check Quality Gate statuses", () => {
    it('Сlick on the "Configure" button in the "Quality Gate" by "Test2code" plugin header', () => {
      cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
      cy.get('[data-test="sidebar:link:Test2Code"]').click();
      cy.get('[data-test="coverage-plugin-header:configure-button"]').click();
      cy.get('input[name="coverage.enabled"]').click();
      cy.get('input[name="coverage.condition.value"]').type("{backspace}").type("17");
      cy.get('input[name="risks.enabled"]').click();
      cy.get('input[name="risks.condition.value"]').type("1");
      cy.get('input[name="tests.enabled"]').click();
      cy.get('button[type="submit"]').click();
      cy.get('[data-test="modal:close-button"]').click();
      cy.get('[data-test="coverage-plugin-header:quality-gate-status"]').contains("PASSED");
    });
  });

  context("Covered methods and associated tests", () => {
    beforeEach(() => {
      cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
      cy.get('[data-test="sidebar:link:Test2Code"]').click();
    });

    it('Open the "Covered Methods" pane with a list of methods', () => {
      const TEST_NAME = "[engine:testng]/[class:api.standalone.StandaloneApiTest]/[method:testNgGetHomePage()]";
      const TEST_TYPE = "Auto";
      const COVERED_METHODS_COUNT = 1;

      cy.get('[data-test="build-overview:tab:build-tests"]').click();

      cy.get('[data-test="test-details:table-wrapper"]')
        .find("table")
        .find("tbody")
        .contains("tr", TEST_NAME)
        .find('[data-test="td-row-coverage.methodCount.covered"]')
        .find("a")
        .click({ force: true });

      cy.get("header").should("have.text", `Covered methods${COVERED_METHODS_COUNT}`);
      cy.get('[data-test="covered-methods-by-test-sidebar:test-name"]').should("have.text", TEST_NAME);
      cy.get('[data-test="covered-methods-by-test-sidebar:test-type"]').should("have.text", TEST_TYPE);
      cy.get('[data-test="covered-methods-list:item"]').should("have.length", COVERED_METHODS_COUNT);
      cy.get('[data-test="dropdown:selected-value"]').should("have.text", "All methods");
    });

    it('Open "Associated tests" pane with the list of tests', () => {
      const PACKAGE_NAME = "org/springframework/samples/petclinic/model";
      const ASSOCIATED_TESTS_COUNT = 1;

      cy.get("table")
        .find("tbody")
        .contains("tr", PACKAGE_NAME)
        .find('[data-test="td-row-cell-assocTestsCount"]')
        .find("a")
        .click({ force: true });

      cy.get('[data-test="associated-test-pane:tests-count"]').should("have.text", ASSOCIATED_TESTS_COUNT);
      cy.get('[data-test="associated-test-pane:package-name"]').should("have.text", PACKAGE_NAME);
      cy.get('[data-test="associated-tests-list:item"]').should("have.length", ASSOCIATED_TESTS_COUNT);
      cy.get('[data-test="dropdown:selected-value"]').should("have.text", "All tests");
      cy.get('[data-test="modal:close-button"]').click();
    });
  });

  context("Risks and Tests to run", () => {
    before(() => {
      cy.task("startPetclinic", { build: "0.5.0" });
      cy.wait(15000);
    });

    beforeEach(() => {
      cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
      cy.get('[data-test="sidebar:link:Test2Code"]').click();
    });

    it("Risks and Tests to run are reduced after the New or Modified method has been covered", () => {
      const INITIAL_RISKS = 5;
      const RISKS_AFTER_COLLECT_COVERAGE = 4;
      const INITIAL_TESTS_TO_RUN = 1;
      const TESTS_TO_RUN_AFTER_COLLECT_COVERAGE = 0;

      cy.get('[data-test="action-section:count:risks"]').should("have.text", INITIAL_RISKS);
      cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", INITIAL_TESTS_TO_RUN);

      cy.task("startPetclinicAutoTests", {}, { timeout: 200000 });

      cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
      cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

      cy.get('[data-test="action-section:count:risks"]').should("have.text", RISKS_AFTER_COLLECT_COVERAGE);
      cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", TESTS_TO_RUN_AFTER_COLLECT_COVERAGE);
    });
  });

  context("Baseline", () => {
    it("All new builds are compared with the Baseline build", () => {
      cy.get('[data-test="name-column"]').contains(AGENT_NAME).click();
      cy.get('[data-test="sidebar:link:Test2Code"]').click();

      cy.get('[data-test="mark-as-baseline-flag"]').click();
      cy.get('button[data-test="baseline-build-modal:set-as-baseline-button"]').should("be.disabled");
      cy.get("input[type=checkbox]").click();
      cy.get('button[data-test="baseline-build-modal:set-as-baseline-button"]').should("not.be.disabled");
      cy.get('button[data-test="baseline-build-modal:set-as-baseline-button"]').click();
      checkSystemMessage("Current build has been set as baseline successfully. All subsequent builds will be compared to it.");

      cy.task("startPetclinic", { build: "0.6.0" });
      cy.get("a").contains("builds").click();
      cy.contains("a", "0.6.0", { timeout: 120000 }).click({ force: true });
      cy.contains("div", "Online", { timeout: 120000 }); // agent is not BUSY
      cy.get('[data-test="sidebar:link:Test2Code"]').click();

      cy.get('[data-test="header:parent-build-version"]').should("have.text", "0.5.0");
      cy.get('[data-test="header:current-build-version"]').should("have.text", "0.6.0");

      cy.contains('[data-test="action-section:count:risks"]', 1).click();
      cy.get('[data-test="risks-pane:risk-name"]').should("have.text", "showOwner");
      cy.get('[data-test="modal:close-button"]').click();

      cy.task("startPetclinicAutoTests", {}, { timeout: 200000 });
      cy.get('button[data-test="active-scope-info:finish-scope-button"]').click();
      cy.get('button[data-test="finish-scope-modal:finish-scope-button"]').click();

      cy.get('[data-test="action-section:count:risks"]').should("have.text", 0);
      cy.get('[data-test="action-section:count:tests-to-run"]').should("have.text", 0);
    });
  });
});
