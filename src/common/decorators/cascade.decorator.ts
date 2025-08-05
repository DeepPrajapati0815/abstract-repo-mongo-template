import "reflect-metadata";

export const CASCADE_DELETE_META_KEY = "CASCADE_DELETE_META";

export interface CascadeDeleteConfig {
  foreignKey: string; // e.g. 'roleId'
  repository: string; // e.g. 'UserRepository'
}

export function Cascade(...relations: CascadeDeleteConfig[]) {
  return function (target: any) {
    Reflect.defineMetadata(CASCADE_DELETE_META_KEY, relations, target);
  };
}

export function getCascadeDeleteMeta(target: any): CascadeDeleteConfig[] {
  return Reflect.getMetadata(CASCADE_DELETE_META_KEY, target) || [];
}
