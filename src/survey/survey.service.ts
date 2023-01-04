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
        data: { ...data, createdBy: userId }
      });
      return survey;
    } catch (e) {
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

  async update(id: string, data: Partial<CreateSurveyDto>, userId: string) {
    try {
      const survey = await this.prisma.survey.findUnique({ where: { id: id } });
      if (!survey) return new NotFoundException({ msg: "Survey not found!" });

      if (survey.createdBy !== userId) {
        return new UnauthorizedException({ msg: "This survey doesn't belong to you!" });
      }

      const updated = await this.prisma.survey.update({ where: { id }, data });

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
