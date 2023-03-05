import { Question, SurveyStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSurveyDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsString() @IsNotEmpty() @IsEnum(SurveyStatus)
    status: SurveyStatus;

    @IsOptional()
    questions: Question[];
};
