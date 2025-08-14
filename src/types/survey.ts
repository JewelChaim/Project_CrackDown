export type QuestionType = "short_text" | "long_text" | "yes_no" | "rating" | "select";

export type BaseQuestion = {
  id: string;
  type: QuestionType;
  label: string;
  required?: boolean;
  helpText?: string;
};

export type SelectQuestion = BaseQuestion & {
  type: "select";
  options: string[];
  multiple?: boolean;
};

export type RatingQuestion = BaseQuestion & {
  type: "rating";
  max?: number;
};

export type ShortTextQuestion = BaseQuestion & { type: "short_text"; placeholder?: string };
export type LongTextQuestion  = BaseQuestion & { type: "long_text";  placeholder?: string };
export type YesNoQuestion     = BaseQuestion & { type: "yes_no" };

export type Question =
  | ShortTextQuestion
  | LongTextQuestion
  | YesNoQuestion
  | RatingQuestion
  | SelectQuestion;

export type SurveyDraft = {
  title: string;
  description?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  allowAnon: boolean;
  startsAt?: string;
  endsAt?: string;
  questions: Question[];
};
