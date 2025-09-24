import { KeyPointsStatus } from "./keypoint-status.model";

export interface TourExecution {
    id: number;
    tourId: number;
    userId: string;
    tourRange: number;
    startTime: Date;
    endTime: Date;
    lastActivity: Date;
    executionStatus: ExecutionStatus;
    keypointsStatus : KeyPointsStatus[];
}
export enum ExecutionStatus {
    Active = 0,         
    Completed = 1, 
    Abandoned = 2        
}