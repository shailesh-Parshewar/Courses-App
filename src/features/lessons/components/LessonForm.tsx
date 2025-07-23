
import RequiredLabelIcon from "@/components/RequiredLabelIcon"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    LessonStatus,
    LessonStatuses,
} from "@/drizzle/schema"
import { Textarea } from "@/components/ui/textarea"



import { ActionToast } from "@/components/ui/sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { lessonSchema } from "../schema/lesson"




const LessonForm = (
    {
        lesson,
        defaultSectionId,
        sections,
        onSuccess }: {
            defaultSectionId: string,
            sections: {
                id: string,
                name: string
            }[],
            lesson?: {
                id: string,
                name: string,
                status: LessonStatus,
                youtubeVideoId: string,
                description: string | null,
                sectionId: string
            }
            onSuccess?: () => void;
        }) => {

    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: lesson?.name ?? "",
            status: lesson?.status ?? "public",
            youtubeVideoId: lesson?.youtubeVideoId ?? "",
            description: lesson?.description ?? "",
            sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "",
        }
    })

    const onSubmit = async (values: z.infer<typeof lessonSchema>) => {
        // const action = lesson == null
        //     ? null
        //     : null;
        // const data = await action(values);

        // ActionToast({ actionData: data })
        // if (!data.error) onSuccess?.();
    }

    const videoId = form.watch("youtubeVideoId");
    
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col @container"
            >
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">

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
                        name="youtubeVideoId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    Youtube Video Id
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
                        name="sectionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Section
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sections.map(section => (
                                            <SelectItem key={section.id} value={section.id} >
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />

                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Status
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {LessonStatuses.map(status => (
                                            <SelectItem key={status} value={status} >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />

                            </FormItem>
                        )}
                    />

                </div>
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
                                <Textarea className="min-h-20 resize-none" {...field} value={field.value ?? ""}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="self-end">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >Save
                    </Button>   
                </div>
                {/* {videoId ?? <YoutubeVideoPlayer videoId={videoId} />} */}
            </form>
        </Form>
    )
}

export default LessonForm;