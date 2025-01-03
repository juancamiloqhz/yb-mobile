import { UserDto } from "@yellowbird-holdings/camelhumps-types"

export enum UserRole {
  WORKER = "worker",
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatusAsString {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
  REQUESTED = "REQUESTED",
  DEACTIVATED = "DEACTIVATED",
}

export type User = UserDto & {
  initials: string
  jobTitle?: string
  role: UserRole
  status: UserStatusAsString
  sid: string
}
