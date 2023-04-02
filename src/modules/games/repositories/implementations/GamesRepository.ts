import { getRepository, Raw, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private repositoryUser: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.repositoryUser = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    let wherePersonalizado = {};
    if (param) {
      wherePersonalizado = [
        {
          title: Raw((title) => `LOWER(${title}) ILIKE '%${param}%'`),
        },
      ];
    }

    return await this.repository
      .createQueryBuilder("games")
      .addSelect(["id", "title", "created_at", "updated_at"])
      .where(wherePersonalizado)
      .getMany();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repositoryUser
      .createQueryBuilder("users")
      .innerJoin("users.games", "games")
      .where("games.id = :gameId", { gameId: id })
      .getMany();
    // Complete usando query builder
  }
}
