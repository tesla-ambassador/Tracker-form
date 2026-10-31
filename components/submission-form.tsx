"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    lengthOfBooking: z.string().min(1, { message: "Length of booking is required" }),
    dateOfBooking: z.date({
        required_error: "Date of booking is required",
    }),
    packageDescription: z.string().min(1, { message: "Package description is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

const SubmissionForm = () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            lengthOfBooking: "",
            dateOfBooking: new Date(),
            packageDescription: "",
        },
    });

    const onSubmit = async (data: FormSchema) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            toast.success('Form submitted successfully! Your booking request has been recorded.');
            form.reset();
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>    
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}  
                />
                <FormField
                    control={form.control}
                    name="lengthOfBooking"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Length of Booking</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter the length of your booking" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateOfBooking"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Booking</FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="packageDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Package Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter the description of your package" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
};

export default SubmissionForm;