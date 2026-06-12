import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

class ScoreRubricClass {
  @prop({ type: Number, default: 0 })
  communication!: number;

  @prop({ type: Number, default: 0 })
  technicalFit!: number;

  @prop({ type: Number, default: 0 })
  cultureFit!: number;

  @prop({ type: Number, default: 0 })
  roleSpecific!: number;
}

class AssignedReviewerClass {
  @prop({ type: String, required: true })
  id!: string;

  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, required: true })
  role!: string;

  @prop({ type: Boolean, default: false })
  feedbackSubmitted!: boolean;
}

class PanelFeedbackClass {
  @prop({ type: String, required: true })
  reviewerId!: string;

  @prop({ type: String, required: true })
  reviewerName!: string;

  @prop({ type: String, required: true })
  reviewerRole!: string;

  @prop({ type: () => ScoreRubricClass, _id: false })
  scores!: ScoreRubricClass;

  @prop({ type: String, default: "" })
  notes!: string;

  @prop({ type: String, required: true })
  recommendation!: string;

  @prop({ type: String })
  submittedAt!: string;
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_interview_sessions",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Session extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  candidateName!: string;

  @prop({ type: String, default: "" })
  candidateEmail!: string;

  @prop({ type: String, required: true })
  role!: string;

  @prop({ type: String, default: "Round 1" })
  round!: string;

  @prop({ type: String, required: true })
  scheduledAt!: string;

  @prop({ type: String, default: "pending" })
  status!: string;

  @prop({ type: () => [AssignedReviewerClass], default: [] })
  assignedReviewers!: AssignedReviewerClass[];

  @prop({ type: () => [PanelFeedbackClass], default: [] })
  feedback!: PanelFeedbackClass[];

  @prop({ type: Number })
  overallScore?: number;

  @prop({ type: String, default: "" })
  notes!: string;
}

export const SessionModel = getModelForClass(Session);
