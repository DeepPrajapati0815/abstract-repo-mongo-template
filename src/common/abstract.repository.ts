/* eslint-disable @typescript-eslint/no-base-to-string */
import mongoose, {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  Types,
} from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { PaginationDto } from "./pagination.dto";
import { RepositoryRegistryService } from "./repository-registry.service";
import {
  getCascadeDeleteMeta,
  CascadeDeleteConfig,
} from "./decorators/cascade.decorator";

export abstract class AbstractRepository<T extends AbstractDocument> {
  protected modelName: string;
  protected cascadeConfig: CascadeDeleteConfig[];

  constructor(
    protected readonly model: Model<T>,
    protected readonly registry: RepositoryRegistryService,
  ) {
    this.modelName = model.modelName.toLowerCase();
    this.registry.register(
      this.constructor.name,
      this as unknown as AbstractRepository<AbstractDocument>,
    );
    this.cascadeConfig = getCascadeDeleteMeta(this.constructor);
  }

  async create(doc: Partial<T>): Promise<T> {
    return new this.model(doc).save();
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.model.findOne({ ...filter, isDeleted: false }, options).exec();
  }

  async findAll(
    filter: FilterQuery<T> = {},
    pagination: PaginationDto = {},
  ): Promise<{
    data: T[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = pagination;
    const query = this.model.find({ ...filter, isDeleted: false });
    const totalResults = await this.model.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalResults / limit);
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .exec();
    return {
      data,
      currentPage: Number(page) || 1,
      totalPages,
      totalResults,
    };
  }

  async aggregateFindAll(
    pipeline: Record<string, any>[] = [],
    pagination: PaginationDto = {},
  ): Promise<{
    data: T[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = pagination;

    const skip = (page - 1) * limit;
    const sortStage = { $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } };

    const pipelineWithDefaultFilter: any[] = [
      { $match: { isDeleted: false } },
      ...pipeline,
      sortStage,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    type AggregateResult = { data: T[]; total: { count: number }[] };
    const result = (await this.model
      .aggregate(pipelineWithDefaultFilter)
      .exec()) as AggregateResult[];

    const totalResults: number =
      Array.isArray(result) &&
      result.length > 0 &&
      Array.isArray(result[0].total) &&
      result[0].total.length > 0 &&
      typeof result[0].total[0].count === "number"
        ? result[0].total[0].count
        : 0;

    const totalPages: number = Math.ceil(totalResults / limit);

    const data: T[] =
      Array.isArray(result) &&
      result.length > 0 &&
      Array.isArray(result[0].data)
        ? result[0].data
        : [];

    return {
      data,
      currentPage: Number(page),
      totalPages,
      totalResults,
    };
  }

  async update(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async softDelete(id: string): Promise<void> {
    await this.model
      .updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() })
      .exec();

    for (const cascade of this.cascadeConfig) {
      const relatedRepo = this.registry.get(cascade.repository);
      if (!relatedRepo) continue;
      const filter = {
        [cascade.foreignKey]:
          typeof id === "string" ? new mongoose.Types.ObjectId(id) : id,
      };

      await relatedRepo.bulkSoftDelete(filter);
    }
  }

  async hardDelete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();

    for (const cascade of this.cascadeConfig) {
      const relatedRepo = this.registry.get(cascade.repository);
      if (!relatedRepo) continue;

      const filter = {
        [cascade.foreignKey]:
          typeof id === "string" ? new mongoose.Types.ObjectId(id) : id,
      };

      await relatedRepo.bulkHardDelete(filter);
    }
  }

  async bulkSoftDelete(filter: Record<string, any>): Promise<void> {
    const docs = await this.model.find(filter).select("_id").lean().exec();

    const ids = docs.map((doc) => doc._id);

    if (!ids.length) return;

    await this.model
      .updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() },
      )
      .exec();

    for (const cascade of this.cascadeConfig) {
      const relatedRepo = this.registry.get(cascade.repository);
      if (!relatedRepo) continue;

      for (const id of ids) {
        const relatedFilter = {
          [cascade.foreignKey]:
            typeof id === "string" ? new mongoose.Types.ObjectId(id) : id,
        };
        await relatedRepo.bulkSoftDelete(relatedFilter);
      }
    }
  }

  async bulkHardDelete(filter: Record<string, any>): Promise<void> {
    const docs = await this.model.find(filter).select("_id").lean().exec();
    const ids = docs.map((doc) => doc._id);
    await this.model.deleteMany({ _id: { $in: ids } }).exec();

    for (const cascade of this.cascadeConfig) {
      const relatedRepo = this.registry.get(cascade.repository);
      if (!relatedRepo) continue;

      for (const id of ids) {
        const relatedFilter = {
          [cascade.foreignKey]:
            typeof id === "string" ? new mongoose.Types.ObjectId(id) : id,
        };
        await relatedRepo.bulkHardDelete(relatedFilter);
      }
    }
  }

  private async handleCascadeRestore(
    filter: Record<string, any>,
    visited = new Set<string>(), // track visited doc IDs
  ) {
    const cascades = getCascadeDeleteMeta(this.constructor);

    const currentIds = await this.findIds(filter);
    const idsToProcess = currentIds.filter((id) => !visited.has(id.toString()));

    if (idsToProcess.length === 0) return;

    // Mark current as visited
    idsToProcess.forEach((id) => visited.add(id.toString()));

    for (const relation of cascades) {
      const relatedRepo = this.registry.get(relation.repository);

      if (!relatedRepo) {
        throw new Error(`Repository not found: ${relation.repository}`);
      }

      const foreignKeyFilter = {
        [relation.foreignKey]: { $in: idsToProcess },
      };

      // pass along visited set to prevent infinite loops
      await relatedRepo.restore(foreignKeyFilter, visited);
    }
  }

  private async findIds(
    filter: Record<string, any>,
  ): Promise<Types.ObjectId[]> {
    const docs = await this.model.find(filter, { _id: 1 }).lean();
    return docs.map((d: any) => d._id);
  }

  async restore(
    filter: FilterQuery<T>,
    visited = new Set<string>(),
  ): Promise<void> {
    const docs = await this.model.find(filter).select("_id").lean();

    const idsToRestore = docs
      .map((d) => d._id)
      .filter((id) => id && !visited.has(id.toString()));

    if (idsToRestore.length === 0) return;

    await this.model.updateMany(
      { _id: { $in: idsToRestore } },
      { isDeleted: false, deletedAt: null },
    );

    for (const id of idsToRestore) {
      await this.handleCascadeRestore({ _id: id }, visited);
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments({ ...filter, isDeleted: false });
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    return (await this.model.exists({ ...filter, isDeleted: false })) != null;
  }
}
