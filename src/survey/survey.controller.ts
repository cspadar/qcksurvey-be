import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard("jwt"))
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto, @User("id") userId) {
    return this.surveyService.create(createSurveyDto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User("id") userId) {
    return this.surveyService.findOne(id, userId);
  }

  @Get()
  findAllMine(@User("id") userId) {
    return this.surveyService.findAllMine(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: Partial<CreateSurveyDto>, @User("id") userId) {
    return this.surveyService.update(id, updateSurveyDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User("id") userId) {
    return this.surveyService.remove(id, userId);
  }
}
