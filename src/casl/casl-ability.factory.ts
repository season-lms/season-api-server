import { User } from 'src/users/schemas/user.schema';
import { Action } from 'src/auth/enums/action.enum';

import { Ability, AbilityClass, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@nestjs/common';

export class Article {
  id: number;
  isPublished: boolean;
  authorId: number;
  title: string;
  contents: string;
}

type Subjects = typeof Article | typeof User | Article | User | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.roles.includes('admin')) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    can(Action.Update, Article, { author: user.userId });
    cannot(Action.Delete, Article, { isPublished: true });

    return build();
  }
}
