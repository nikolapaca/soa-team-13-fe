
export interface TourReview {
  Id: number;
  Rating: number;
  Comment: string | null;
  TourDate: string;
  CreationDate: string;
  TouristId: number;
  TourId: number;
}
