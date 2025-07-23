"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { courseSchema } from "../schemas/courses"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import RequiredLabelIcon from "@/components/RequiredLabelIcon"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createCourse, updateCourse } from "../actions/courses"
import { ActionToast } from "@/components/ui/sonner"

type course = {
    id: string;
    name: string;
    description: string;
} 

const CourseForm = ({ course }
     : {course? : course}) => {
    const form = useForm<z.infer<typeof courseSchema>>({
        resolver: zodResolver(courseSchema),
        defaultValues: course ?? {
            name: "",
            description: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof courseSchema>) => {
        const action = course == null ? createCourse : updateCourse.bind(null, course.id);
        const data = await action(values);

        ActionToast({ actionData: data })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col "
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabelIcon />
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabelIcon />
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea className="min-h-20 resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="self-end">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >Save</Button>
                </div>
            </form>
        </Form>
    )
}
export default CourseForm