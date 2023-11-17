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
import axios from 'axios'
import { Role } from '../models'
import { getUserInfo } from '../user-authentication/api'

type RoleStatus = {
  isRole: boolean | null
  isError: boolean
  errorMessage: string | null
}

const userHasRole = (role: Role) => (): RoleStatus => {
  const [isError, setIsError] = useState<boolean>(false)
  const [isRole, setIsRole] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo()
        setIsRole(userInfo.role == role)
      } catch (error) {
        switch (error?.response?.status) {
          case 401:
          case 403:
            setIsRole(false)
            break
          default:
            setIsError(true)
            setErrorMessage(error?.response?.data?.message || "Unexpected server error occurred")
        }
      }
    }
    fetchData()
  }, [])

  return { isRole, isError, errorMessage }
}

export default userHasRole
