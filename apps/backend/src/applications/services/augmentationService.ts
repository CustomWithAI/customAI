import type { AugmentationRepository } from "@/applications/repositories/augmentationRepository";
import type { augmentations } from "@/domains/schema/augmentations";
import type { PaginationParams } from "@/utils/db-type";

export class AugmentationService {
	public constructor(private repository: AugmentationRepository) {}

	public async createAugmentation(data: typeof augmentations.$inferInsert) {
		return this.repository.create(data);
	}

	public async getAugmentationsByUserId(
		userId: string,
		pagination: PaginationParams,
	) {
		return this.repository.findByUserId(userId, pagination);
	}

	public async getAugmentationById(id: string) {
		return this.repository.findById(id);
	}

	public async updateAugmentation(
		id: string,
		data: Partial<typeof augmentations.$inferInsert>,
	) {
		return this.repository.updateById(id, data);
	}

	public async deleteAugmentation(id: string) {
		return this.repository.deleteById(id);
	}
}
