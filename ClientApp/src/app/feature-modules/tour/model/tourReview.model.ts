
export interface TourReview {
  id: number;
  rating: number;
  comment: string | null;
  tourDate: string;
  creationDate: string;
  touristId: number;
  tourId: number;
}
