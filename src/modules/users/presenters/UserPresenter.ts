import { UserEntity } from "../entities/Users";

export class UserPresenter {
  static execute(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
      companies: user.companies,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
