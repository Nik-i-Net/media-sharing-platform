import { User, type Identity } from '../domain/user';
import { TodoError } from '@/shared/errors';
import type { UsersRepository } from '../domain/users.repository';
import type { PlanProvider } from './ports/plan.provider';

type Identities = [Identity, ...Identity[]];

export interface ResolveUserIdCommand {
  externalId: string;
  email: string | null;
  emailVerified: boolean;
  identities: Identities;
}

// TODO: split into: register, resolveUserId (only for getting userId) and syncIdentities
export class ResolveUserIdCommandHandler {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly planProvider: PlanProvider,
  ) {}

  async execute(cmd: ResolveUserIdCommand): Promise<string> {
    const userByExternalId = await this.usersRepo.findByExternalId(cmd.externalId);
    if (userByExternalId) {
      await this.syncIdentities(userByExternalId, cmd.identities);
      return userByExternalId.id;
    }

    if (cmd.email) {
      const userByEmail = await this.usersRepo.findByEmail(cmd.email);
      if (userByEmail) await this.resolveEmailConflict(userByEmail, cmd.emailVerified);
    }

    const newUser = User.register({
      id: crypto.randomUUID(),
      externalId: cmd.externalId,
      email: cmd.email,
      emailVerified: cmd.emailVerified,
      identity: cmd.identities[0],
      plan: await this.planProvider.getDefaultPlan(),
    });
    await this.usersRepo.save(newUser);

    return newUser.id;
  }

  private async syncIdentities(user: User, identities: Identities) {
    const lastUpdatedAt = user.updatedAt;
    const includes = (arr: Identity[], value: Identity) => {
      return arr.some((i) => i.provider === value.provider && i.userId === value.userId);
    };

    for (const i of user.identities) {
      if (!includes(identities, i)) user.removeIdentity(i);
    }

    for (const i of identities) {
      if (!includes(user.identities, i)) user.addIdentity(i);
    }

    if (user.updatedAt !== lastUpdatedAt) await this.usersRepo.save(user);
  }

  private async resolveEmailConflict(userByEmail: User, newEmailVerified: boolean) {
    if (!userByEmail.emailVerified && newEmailVerified) {
      userByEmail.removeEmail();
      userByEmail.suspendAccount();
      await this.usersRepo.save(userByEmail);
    } else {
      throw new TodoError('Email already in use. Login to link accounts');
    }
  }
}
