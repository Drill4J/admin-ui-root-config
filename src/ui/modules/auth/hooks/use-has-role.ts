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

import { useState, useEffect } from 'react'
import { Role } from '../models'
import useUserInfo from './use-user-info'

function hasRole(role: Role) {
  const [hasRole, setHasRole] = useState<boolean | null>(null)
  const userInfoResponse = useUserInfo()
  useEffect(()=> {
    if (userInfoResponse.data == null) return;
    setHasRole(userInfoResponse.data.role === role)
  },[userInfoResponse.data])
  return { ...userInfoResponse, hasRole }
}

function userHasAdminRole () {
  return hasRole(Role.ADMIN)
}
function userHasUserRole () {
  return hasRole(Role.USER)
}
function userHasUndefinedRole () {
  return hasRole(Role.UNDEFINED)
}

export {
  userHasAdminRole,
  userHasUserRole,
  userHasUndefinedRole,
} 
