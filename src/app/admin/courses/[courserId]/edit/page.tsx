import { db } from '@/drizzle/db';
import { CourseLessonTable, CourseSectionTable, CourseTable } from '@/drizzle/schema';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { asc, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';
import React from 'react'

const EditCoursePage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  console.log(course)
  // if (course == null) return notFound();

  return (
    <div>page</div>
  )
}

export default EditCoursePage;

async function getCourse(courseId: string) {
  // "use cache";
  // cacheTag(getCourseIdTag(courseId), getCourseSectionCourseTag(courseId), getLessonCourseTag(courseId));

  return await db.query.CourseTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(CourseTable.id, courseId),
      with: {
      sections: {
        orderBy: asc(CourseSectionTable.order),
        columns: { id: true, name: true, status: true },

        with: {
          lessons: {
            orderBy: asc(CourseLessonTable.order),
            columns: {
              id: true,
              name: true,
              status: true,
              description: true,
              youtubeVideoId: true
            },
          }
        }
      }
    }
  })
}

console.log(await getCourse("603f74f8-a09b-4085-9054-4ba539f89154"))

//  with: {
//       sections: {
//         orderBy: asc(CourseSectionTable.order),
//         columns: { id: true, name: true, status: true },

//         with: {
//           lessons: {
//             orderBy: asc(CourseLessonTable.order),
//             columns: {
//               id: true,
//               name: true,
//               status: true,
//               description: true,
//               youtubeVideoId: true
//             },
//           }
//         }
//       }
//     }