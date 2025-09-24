import { KeyPoint } from "../feature-modules/tour/model/keyPoint.model";

export interface KeyPointsStatus {
    id: number;
    keyPointId: number;
    keyPoint: KeyPoint;
    completionTime: Date;
}