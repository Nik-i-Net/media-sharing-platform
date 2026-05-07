// import { Collection } from '../domain/entities/collection';
// import type { CollectionRepository } from '../domain/repositories/collection.repository';
// import type { CreateCollectionDto } from './dto';
// import type { CollectionSummaryDto } from './dto/collections/collection-summary.dto';
// import type { CollectionDto } from './dto/collections/collection.dto';
// import type { IdGeneratorService } from './ports/id-generator.service';
//
// interface ListCollectionsDto {
//   userId: string;
//   page: number;
//   limit: number;
// }
//
// interface GetCollectionDto {
//   userId?: string;
//   collectionId: string;
// }
//
// interface UpdateCollectionDto {
//   userId: string;
//   collectionId: string;
//   updates: {
//     title?: string;
//     isPublic?: boolean;
//   };
// }
//
// interface DeleteCollectionDto {
//   userId: string;
//   collectionId: string;
// }
//
// export class CollectionService {
//   constructor(
//     private readonly collectionRepository: CollectionRepository,
//     private readonly idGenerator: IdGeneratorService,
//   ) {}
//
//   async create(dto: CreateCollectionDto): Promise<CollectionDto> {
//     const collectionId = this.idGenerator.generateNanoId();
//     const collection = Collection.create(collectionId, dto.userId, dto.collectionName);
//     await this.collectionRepository.save(collection);
//     return this.mapCollectionToDto(collection, true);
//   }
//
//   async list(dto: ListCollectionsDto): Promise<CollectionSummaryDto[]> {
//     const { userId, page, limit } = dto;
//     const offset = (page - 1) * limit;
//     const collections = await this.collectionRepository.findAllByUserId(userId, limit, offset);
//     return collections.map((collection) => this.mapCollectionToSummaryDto(collection));
//   }
//
//   async getOne(dto: GetCollectionDto): Promise<CollectionDto> {
//     const { userId, collectionId } = dto;
//     const collection = await this.collectionRepository.findById(collectionId);
//     if (!collection) throw new Error('TODO: Collection not found');
//
//     const isOwner = userId === collection.userId;
//     if (!isOwner && !collection.isPublic) throw new Error('TODO: Forbidden');
//
//     return this.mapCollectionToDto(collection, isOwner);
//   }
//
//   async update(dto: UpdateCollectionDto): Promise<CollectionDto> {
//     const { userId, collectionId, updates } = dto;
//     const collection = await this.collectionRepository.findById(collectionId);
//     if (!collection) throw new Error('TODO: Collection not found');
//
//     const isOwner = userId === collection.userId;
//     if (!isOwner) throw new Error('TODO: Forbidden');
//
//     if (updates.title) collection.changeTitle(updates.title);
//     if (updates.isPublic) collection.setPublic(updates.isPublic);
//     await this.collectionRepository.save(collection);
//
//     return this.mapCollectionToDto(collection, isOwner);
//   }
//
//   async delete(dto: DeleteCollectionDto): Promise<void> {
//     const { userId, collectionId } = dto;
//     const collection = await this.collectionRepository.findById(collectionId);
//     if (!collection) throw new Error('TODO: Collection not found');
//     if (userId !== collection.userId) throw new Error('TODO: Forbidden');
//
//     await this.collectionRepository.delete(collectionId);
//   }
//
//   private mapCollectionToDto(collection: Collection, isOwner: boolean): CollectionDto {
//     return {
//       id: collection.id,
//       title: collection.title,
//       media: [],
//       isPublic: collection.isPublic,
//       canEdit: isOwner,
//     };
//   }
//
//   private mapCollectionToSummaryDto(collection: Collection): CollectionSummaryDto {
//     return {
//       id: collection.id,
//       title: collection.title,
//     };
//   }
// }
