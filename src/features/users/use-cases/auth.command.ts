import { Identity } from '../entities/identity';
import { User } from '../entities/user';
import type { UnitOfWork } from '@shared/ports/unit-of-work';
import { TodoException } from '@shared/errors';

export class AuthCommand {
  constructor(
    readonly provider: string,
    readonly providerUserId: string,
    readonly email?: string,
    readonly emailVerified?: boolean,
  ) {}
}

export class AuthCommandHandler {
  constructor(private readonly uow: UnitOfWork) {}

  async execute({ provider, providerUserId, email, emailVerified }: AuthCommand) {
    this.uow.execute(async (repos) => {
      const foundIdentity = await repos.identities.findByProviderIdentity(provider, providerUserId);
      if (foundIdentity) return foundIdentity.userId;

      if (email && emailVerified) {
        const foundUser = await repos.users.findByEmail(email);
        if (foundUser) throw new TodoException('User already exists. Sign in to link accounts.');
      }

      const user = User.register({ id: crypto.randomUUID(), email, emailVerified });
      await repos.users.save(user);

      const identity = Identity.register({
        id: crypto.randomUUID(),
        userId: user.id,
        provider,
        providerUserId,
        email,
        emailVerified,
      });
      await repos.identities.save(identity);

      return user.id;
    });
  }
}
