import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto, @Req() req) {
    return this.surveyService.create(createSurveyDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.surveyService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: Partial<CreateSurveyDto>, @Req() req) {
    return this.surveyService.update(id, updateSurveyDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.surveyService.remove(id, req.user.id);
  }
}
