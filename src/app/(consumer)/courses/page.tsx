import PageHeader from '@/components/PageHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/drizzle/db';
import { CourseLessonTable, CourseSectionTable, CourseTable, UserCourseAccessTable, UserLessonCompleteTable } from '@/drizzle/schema';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { getUserCourseAccessUserTag } from '@/features/courses/db/cache/userCourseAccess';
import { getCourseSectionCourseTag, getCourseSectionIdTag } from '@/features/courseSections/db/cache';
import { wherePublicCourseSections } from '@/features/courseSections/permissions/section';
import { getUserLessonCompleteUserTag } from '@/features/lessons/db/cache/LessonComplete';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { wherePublicLesson } from '@/features/lessons/permissions/lessons';
import { getCurrentUser } from '@/services/clerk';
import { and, countDistinct, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'

const CoursesPage = () => {
  return (
    <div className='container my-6'>
      <PageHeader title='My courses' />
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4'>
        <Suspense fallback={null} >
          <CourseGrid />
        </Suspense>
      </div>
    </div>
  )
}

export default CoursesPage;


async function CourseGrid() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const courses = await getUserCourses(userId);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent></CardContent>
    </Card>
  )
};

async function getUserCourses(userId: string) {
  "use cache";
  cacheTag(
    getUserCourseAccessUserTag(userId),
    getUserLessonCompleteUserTag(userId)
  );

  const courses = await db.select(
    {
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      sectionCount: countDistinct(CourseSectionTable.id),
      lessonCount: countDistinct(CourseLessonTable.id),
      lessonComplete: countDistinct(UserLessonCompleteTable.lessonId),
    })
    .from(CourseTable)
    .leftJoin(UserCourseAccessTable,
      and(
        eq(UserCourseAccessTable.courseId, CourseTable.id),
        eq(UserCourseAccessTable.userId, userId)
      )
    )
    .leftJoin(CourseSectionTable, and(
      eq(CourseSectionTable.courseId, CourseTable.id),
      wherePublicCourseSections)
    )
    .leftJoin(CourseLessonTable,
      and(
        eq(CourseLessonTable.sectionId, CourseSectionTable.id),
        wherePublicLesson)
    )
    .leftJoin(UserLessonCompleteTable,
      and(eq(UserLessonCompleteTable.lessonId, CourseLessonTable.id),
        eq(UserLessonCompleteTable.userId, userId)
      )
    )
    .groupBy(CourseTable.id)
    .orderBy(CourseTable.name);

    courses.forEach(course => {
      cacheTag(
        getCourseIdTag(course.id),
        getCourseSectionCourseTag(course.id),
        getLessonCourseTag(course.id),
      )
    })

}