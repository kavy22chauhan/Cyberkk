import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const submitContact = useSubmitContact();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await submitContact.mutateAsync({ data });
      setIsSuccess(true);
      form.reset();
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 border border-primary/20">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Secure Comms</h1>
        <p className="text-muted-foreground text-lg">
          Need enterprise support or have a security inquiry? Send us an encrypted message via the terminal below.
        </p>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-cyan-400" />
        <CardContent className="p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
              <h3 className="text-2xl font-bold text-white">Transmission Successful</h3>
              <p className="text-muted-foreground">Our team has received your message and will respond shortly.</p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                Send Another Message
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Operative Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-background/50 border-white/20" {...field} />
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
                        <FormLabel className="text-white/80">Return Address (Email)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="bg-background/50 border-white/20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="API Integration Inquiry" className="bg-background/50 border-white/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Encrypted Payload (Message)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about your request..." 
                          className="min-h-[150px] bg-background/50 border-white/20 resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={submitContact.isPending} 
                  className="w-full h-12 text-md font-medium"
                >
                  {submitContact.isPending ? (
                    <span className="flex items-center gap-2">Encrypting & Sending...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Transmit Data</span>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
