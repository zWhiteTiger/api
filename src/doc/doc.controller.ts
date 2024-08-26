import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DocService } from './doc.service';
import { DocsDto } from './dto/docs.dto';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Post()
  async create(@Body() dto: DocsDto) {
    return this.docService.create(dto);
  }

  @Get()
  async findAll() {
    return this.docService.findAll();
  }
}


// @Get(':docId')
// async findOne(@Param('docId') docId: string): Promise<Doc> {
//   // Log the received docId and its type
//   console.log(`DocController.findOne received docId:`, docId, `Type:`, typeof docId);

//   return this.docService.findOne(docId);
// }

// @Delete(':docId')
// async deleteOne(@Param('docId') docId: string): Promise<Doc> {
//   // Log the received docId and its type
//   console.log(`DocController.deleteOne received docId:`, docId, `Type:`, typeof docId);

//   return this.docService.deleteOne(docId);
// }
