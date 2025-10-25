
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useReceits } from "@/lib/receit-context";
import { priorities, type Receit, receitSchema } from "@/lib/types";
import React from "react";
import { Badge } from "./ui/badge";

type ReceitFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receit?: Receit;
};


export function ReceitForm({ open, onOpenChange, receit }: ReceitFormProps) {
  const { addReceit, updateReceit, receits, categories } = useReceits();
  const { toast } = useToast();
  const isEditing = !!receit;

  // Create a version of the schema for the form that doesn't require the ID.
  const formSchema = receitSchema.omit({ id: true, status: true, userId: true });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
        ...receit,
        startDate: receit.startDate ? new Date(receit.startDate) : new Date(),
        dueDate: receit.dueDate ? new Date(receit.dueDate) : new Date(),
      }
      : {
          title: "",
          description: "",
          priority: "Medium",
          category: "",
          effort: 0,
          startDate: new Date(),
          dueDate: new Date(),
          linkedReceits: [],
        },
  });

  React.useEffect(() => {
    if(open) {
      if (receit) {
        form.reset({
            ...receit,
            startDate: new Date(receit.startDate),
            dueDate: new Date(receit.dueDate),
        });
      } else {
        form.reset({
            title: "",
            description: "",
            priority: "Medium",
            category: "Development",
            effort: 1,
            startDate: new Date(),
            dueDate: new Date(),
            linkedReceits: [],
          });
      }
    }
  }, [receit, form, open]);


  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (isEditing && receit) {
        updateReceit({ ...receit, ...data });
        toast({ title: "ReceIT Updated", description: `"${data.title}" has been updated.` });
      } else {
        addReceit(data);
        toast({ title: "ReceIT Created", description: `A new task "${data.title}" has been added.` });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not save the ReceIT. Please try again.",
      });
    }
  }

  const otherReceits = receits.filter(r => r.id !== receit?.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline">{isEditing ? 'Edit' : 'Create'} ReceIT</SheetTitle>
          <SheetDescription>
            {isEditing ? 'Update the details of your task.' : 'Fill out the form to add a new task to your list.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Deploy to production" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more context about the task..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Category</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value
                                                ? categories.find((cat) => cat === field.value) ?? field.value
                                                : "Select or create category"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput 
                                            placeholder="Search or create..."
                                            onValueChange={(search) => { if (!categories.includes(search)) field.onChange(search); }}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No category found. Type to create.</CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((cat) => (
                                                    <CommandItem
                                                        value={cat}
                                                        key={cat}
                                                        onSelect={() => form.setValue("category", cat)}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", cat === field.value ? "opacity-100" : "opacity-0")} />
                                                        {cat}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="effort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effort (Points)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="linkedReceits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link ReceITs</FormLabel>
                  <FormDescription>Create dependencies or group related tasks.</FormDescription>
                   <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between h-auto min-h-10"
                                >
                                    <div className="flex flex-wrap gap-1">
                                    {field.value && field.value.length > 0 ? (
                                        field.value.map(id => {
                                            const receit = otherReceits.find(r => r.id === id);
                                            return receit ? <Badge key={id} variant="secondary" className="font-normal">{receit.title}</Badge> : null;
                                        })
                                    ) : (
                                        <span className="text-muted-foreground font-normal">Select ReceITs to link</span>
                                    )}
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search ReceITs..." />
                                <CommandList>
                                <CommandEmpty>No receits found.</CommandEmpty>
                                <CommandGroup>
                                    {otherReceits.map((r) => (
                                        <CommandItem
                                            value={r.title}
                                            key={r.id}
                                            onSelect={() => {
                                                const currentValue = field.value || [];
                                                const newValue = currentValue.includes(r.id) 
                                                    ? currentValue.filter(id => id !== r.id) 
                                                    : [...currentValue, r.id];
                                                form.setValue("linkedReceits", newValue);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", field.value?.includes(r.id) ? "opacity-100" : "opacity-0")} />
                                            {r.title}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-8">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create ReceIT'}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

    