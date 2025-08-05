// src/common/repository-registry/repository-registry.module.ts
import { Global, Module } from "@nestjs/common";
import { RepositoryRegistryService } from "./repository-registry.service";

@Global()
@Module({
  providers: [RepositoryRegistryService],
  exports: [RepositoryRegistryService],
})
export class CommonModule {}
