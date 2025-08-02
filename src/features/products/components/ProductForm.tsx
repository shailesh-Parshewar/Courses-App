"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import RequiredLabelIcon from "@/components/RequiredLabelIcon"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { ActionToast } from "@/components/ui/sonner"
import { ProductSchema } from "../schema/product"
import { createProduct, updateProduct } from "../actions/products"
import { productStatus, productStatuses } from "@/drizzle/schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/custom/multiSelect"
import { redirect } from "next/navigation"


type product = {
    id: string,
    name: string;
    description: string;
    imageUrl: string;
    courseIds: string[];
    price: number;
    status: productStatus;
}

const ProductForm = ({
    product,
    courses }
    : {
        product?: product,
        courses: {
            id: string,
            name: string
        }[]
    }) => {
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: product ?? {
            name: "",
            description: "",
            imageUrl: "",
            courseIds: [],
            price: 0,
            status: "private"
        }
    })

   
    const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
        console.log(values.courseIds);
        const action = product == null ? createProduct : updateProduct.bind(null, product.id);
        const data = await action(values);

        ActionToast({ actionData: data });
        redirect("/admin/products");
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col "
            >
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-3" >
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
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    Price in Dollars
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        step={1} min={0}
                                        onChange={e => field.onChange(isNaN(e.target.valueAsNumber)
                                             ? ""
                                             : e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    Image Url
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
                                        {productStatuses.map(status => (
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
                    name="courseIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Included Courses</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    selectPlaceholder="Select courses"
                                    searchPlaceholder="Search courses"
                                    options={courses}
                                    getLabel={c => c.name}
                                    getValue={c => c.id}
                                    selectedValues={field.value}
                                    onSelectedValuesChange={field.onChange}
                                />
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
export default ProductForm
