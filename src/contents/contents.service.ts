import { Inject, Injectable } from '@nestjs/common';
import { AttachmentsService } from '../attachments/attachments.service';
import { LecturesService } from '../lectures/lectures.service';
import { AssignmentsService } from 'src/assignments/assignments.service';

@Injectable()
export class ContentsService {
  @Inject() private readonly lecturesService: LecturesService;
  @Inject() private readonly attachmentsService: AttachmentsService;
  @Inject() private readonly assignmentsService: AssignmentsService;

  public async getContents(courseId: string, classNumber: number) {
    const response = this.createResponseArray(16);

    await this.getLectures(courseId, classNumber, response);
    await this.getAttachments(courseId, classNumber, response);
    await this.getAssignments(courseId, classNumber, response);

    return response;
  }

  private async getLectures(courseId: string, classNumber: number, response) {
    try {
      const lectures = await this.lecturesService.findAll(
        courseId,
        classNumber,
      );
      lectures.forEach((lecture) => {
        const { week } = lecture;
        const content = response.find((elem) => elem.week === week);
        content.lectures.push(this.lecturesService.filterLecture(lecture));
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  private async getAttachments(
    courseId: string,
    classNumber: number,
    response,
  ) {
    try {
      const attachments = await this.attachmentsService.findAll(
        courseId,
        classNumber,
      );
      attachments.forEach((attach) => {
        const { week } = attach;
        const content = response.find((elem) => elem.week === week);
        content.attachments.push(
          this.attachmentsService.filterAttachment(attach),
        );
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  private async getAssignments(
    courseId: string,
    classNumber: number,
    response,
  ) {
    try {
      const assignments = await this.assignmentsService.findAll(
        courseId,
        classNumber,
      );
      assignments.forEach((assignment) => {
        const { week } = assignment;
        const content = response.find((elem) => elem.week === week);
        content.assignments.push(
          this.assignmentsService.filterAssignment(assignment),
        );
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }

  private createResponseArray(maxWeek) {
    const response = [];
    for (let i = 1; i <= maxWeek; i++) {
      response.push({
        week: i,
        lectures: [],
        assignments: [],
        attachments: [],
      });
    }
    return response;
  }
}
