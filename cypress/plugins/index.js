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
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
import { exec } from "child_process";
import { writeFile } from "fs";

module.exports = (on) => {
  on("task", {
    async removeContainers() {
      const containersIds = await promisifiedExec("docker ps -aq");
      if (containersIds) {
        const stoppedIds = await promisifiedExec(`docker stop ${containersIds.replaceAll(/\s+/g, " ")}`);
        console.log(`Stopped containers: ${stoppedIds}`);
        const removedIds = await promisifiedExec(`docker rm ${containersIds.replaceAll(/\s+/g, " ")}`);
        console.log(`Removed containers: ${removedIds}`);
        await promisifiedExec("docker volume prune -f");
        await promisifiedExec("docker network prune -f");
      }
      return null;
    },
    async startAdmin() {
      const containersIds = await promisifiedExec("docker-compose -f docker-compose.admin.yml up -d");
      console.log(`Started containers: ${containersIds}`);
      return null;
    },
    async startPetclinic({ agentId = "dev-pet-standalone", build = "0.1.0" }) {
      const data = `
      PET_STANDALONE_BUILD=${build}
      agentId=${agentId}
      PET_STANDALONE_PORT=8087
      adminAddress=drill-admin:8090
      LOG_LEVEL=DEBUG
      `;
      writeFile("./java-agent-example.env", data, "utf-8", (err) => {
        if (err) {
          console.log(err.message);
        }
        console.log(`PET_STANDALONE_BUILD=${build} copied to java-agent-example.env`);
      });
      await promisifiedExec("docker-compose -f java-agent-example.yml --env-file java-agent-example.env up -d");
      return null;
    },
    async startPetclinicMicroservice({ groupId = "dev-pet-mcr", build = "0.1.0" }) {
      const data = `
      adminAddress=drill-admin:8090
      PET_MCR_BUILD=${build}
      AGENT_VERSION=latest
      groupId=${groupId}
      LOG_LEVEL=DEBUG
      `;
      writeFile("./java-mcr-agent-example.env", data, "utf-8", (err) => {
        if (err) {
          console.log(err.message);
        }
      });
      await promisifiedExec("docker-compose -f docker-compose-pet-mcr.yml --env-file java-mcr-agent-example.env up -d");
      return null;
    },
    async startPetclinicAutoTests() {
      await promisifiedExec("docker-compose -f start-petclinic-tests.yml up");
      console.log("petclinic tests container exited");
      return null;
    },
    async startPetclinicMicroserviceAutoTests() {
      await promisifiedExec("docker-compose -f start-petclinic-microservice-tests.yml up");
      console.log("petclinic microservice tests container exited");
      return null;
    },
  });
};

function promisifiedExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, {}, (err, out) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(out);
    });
  });
}
