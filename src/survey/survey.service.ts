import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SurveyStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyDto } from './dto';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {

  }
  async create(data: CreateSurveyDto, userId: string) {

    try {
      const survey = await this.prisma.survey.create({
        data: {
          title: data.title,
          status: data.status,
          createdBy: userId,
          questions: { create: data.questions }
        },
      });
      return survey;
    } catch (e) {
      console.log(e);
      throw new BadRequestException({ msg: "Database error" })
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const survey = await this.prisma.survey.findUnique({ where: { id: id } });
      if (!survey) return new NotFoundException({ msg: "Survey not found!" });
      if (survey.createdBy !== userId && survey.status === SurveyStatus.PRIVATE) {
        // TODO: Check if survey is shared with the current user
        return new UnauthorizedException({ msg: "This survey doesn't belong to you!" });
      }
      return survey;
    } catch (e) {
      return new BadRequestException({ msg: "Database error" })
    }
  }

  async findAllMine(userId: string) {
    try {
      const surveys = await this.prisma.survey.findMany({ where: { createdBy: userId } });
      return surveys;
    } catch (e) {
      return new BadRequestException({ msg: "Database error" })
    }
  }

  async update(id: string, data: Partial<CreateSurveyDto>, userId: string) {
    try {
      const survey = await this.prisma.survey.findUnique({ where: { id: id } });
      if (!survey) return new NotFoundException({ msg: "Survey not found!" });

      if (survey.createdBy !== userId) {
        return new UnauthorizedException({ msg: "This survey doesn't belong to you!" });
      }

      const updated = await this.prisma.survey.update({
        where: { id },
        data: { title: data.title }
      });

      if (data.questions) {
        this.prisma.$transaction([
          this.prisma.question.deleteMany({ where: { id: id } }),
          this.prisma.question.createMany({ data: data.questions }),
        ]);
      };

      return updated;
    } catch (e) {
      return new BadRequestException({ msg: "Database error" })
    }
  }

  async remove(id: string, userId: string) {
    try {
      const survey = await this.prisma.survey.findUnique({ where: { id: id } });
      if (!survey) return new NotFoundException({ msg: "Survey not found!" });

      if (survey.createdBy !== userId) {
        return new UnauthorizedException({ msg: "This survey doesn't belong to you!" });
      }

      // TODO: Consider adding userId in the where clause, to avoid double db query
      const deleted = await this.prisma.survey.delete({ where: { id } });

      return deleted;
    } catch (e) {
      return new BadRequestException({ msg: "Database error" })
    }
  }
}
