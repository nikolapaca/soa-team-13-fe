import { KeyPoint } from "./keyPoint.model";
import { TourDuration } from "./tourDurarion.model";
import { TourReview } from "./tourReview.model";

export interface Tour {
    id: number,
    name: string,
    difficulty: number,
    description: string,
    cost: number,
    status: number,
    tags: string,
    length: number,
    authorId: string,
    image: string,
    keyPoints: KeyPoint[],
    reviews: TourReview[],
    durations: TourDuration[]
}

