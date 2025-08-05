// src/common/repository-registry.service.ts
import { Injectable } from "@nestjs/common";
import { AbstractRepository } from "./abstract.repository";
import { AbstractDocument } from "./abstract.schema";

@Injectable()
export class RepositoryRegistryService {
  private readonly repositories: Map<
    string,
    AbstractRepository<AbstractDocument>
  > = new Map();
  private readonly cascadeMap: Record<string, string[]> = {};

  register(key: string, repo: AbstractRepository<AbstractDocument>): void {
    this.repositories.set(key, repo);
  }

  get(key: string): AbstractRepository<AbstractDocument> | undefined {
    return this.repositories.get(key);
  }

  setCascadeFields(repoKey: string, relatedRepos: string[]): void {
    this.cascadeMap[repoKey] = relatedRepos;
  }

  getCascadeFields(repoKey: string): string[] {
    return this.cascadeMap[repoKey] || [];
  }
}
