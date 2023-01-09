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
  create(@Body() createSurveyDto: CreateSurveyDto, @User() user) {
    return this.surveyService.create(createSurveyDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this.surveyService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: Partial<CreateSurveyDto>, @User() user) {
    return this.surveyService.update(id, updateSurveyDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user) {
    return this.surveyService.remove(id, user.id);
  }
}
