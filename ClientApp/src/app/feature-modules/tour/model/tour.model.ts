import { KeyPoint } from "./keyPoint.model";
import { TourReview } from "./tourReview.model";

export interface Tour {
  id: number;
  name: string;
  difficulty: number;
  description: string;
  cost: number;
  status: string;
  tags: string;
  keyPoints: KeyPoint[];
  length: number;
  authorId: string;
  image: string;
  reviews: TourReview[];
}

