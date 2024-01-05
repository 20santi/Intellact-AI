"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/Heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loader";
import { cn } from "@/lib/utils";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";

interface messageType {
  question: string;
  value: string;
}

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<messageType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [ userMessage ];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      console.log("response: ", response);
      const conversation = {
        question: values.prompt,
        value: response.data,
      };
      setMessages((current) => [...current, conversation]);

      form.reset();
    } catch (error: any) {
      //TODO: open pro model
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    console.log("messages:---> ", messages);
  }, [messages]);

  return (
    <div className="">
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid 
              grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Create a MongoDB schema for me"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label="No conversation started" />
            </div>
          )}
          <div className="space-y-4 mt-4">
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => (
                <div className="flex flex-col gap-y-2" key={index}>
                  <div
                    className={cn(
                      "p-8 w-full items-start rounded-lg bg-white border border-black/10 flex gap-x-5"
                    )}
                  >
                    <UserAvatar />
                    <p>{message.question}</p>
                  </div>
                  <div
                    className={cn(
                      "p-8 w-full items-start rounded-lg bg-muted flex gap-x-5"
                    )}
                  >
                    <BotAvatar />
                    <p>{message.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
