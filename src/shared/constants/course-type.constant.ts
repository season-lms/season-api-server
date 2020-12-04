export enum CourseType {
  'unknown',
  'general_elective_course',
  'general_required_course',
  'major_elective_course',
  'major_required_course',
  'basic_required_course',
}

export const courseArray = Object.values(CourseType);
