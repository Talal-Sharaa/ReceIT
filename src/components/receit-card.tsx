"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useReceits } from "@/lib/receit-context";
import type { Receit } from "@/lib/types";
import { Briefcase, Calendar, Edit, Hash, Link as LinkIcon, Megaphone, MoreVertical, Trash2, User } from "lucide-react";
import { format } from 'date-fns';
import { ReceitForm } from './receit-form';

type ReceitCardProps = {
  receit: Receit;
};

const categoryIcons: { [key: string]: React.ReactNode } = {
  Development: <Briefcase className="h-4 w-4" />,
  Marketing: <Megaphone className="h-4 w-4" />,
  Personal: <User className="h-4 w-4" />,
};

const getPriorityBadgeVariant = (priority: Receit['priority']) => {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    case 'Low': return 'outline';
    default: return 'default';
  }
};

export function ReceitCard({ receit }: ReceitCardProps) {
  const { updateReceit, deleteReceit, getReceitById } = useReceits();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleStatusChange = (checked: boolean) => {
    updateReceit({ ...receit, status: checked ? 'Done' : 'To-Do' });
  };

  const handleDelete = () => {
    deleteReceit(receit.id);
  };
  
  const linkedReceitObjects = receit.linkedReceits.map(id => getReceitById(id)).filter(Boolean) as Receit[];

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-lg mb-1 pr-8">{receit.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsFormOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="flex items-center gap-4 text-xs text-muted-foreground">
             <Badge variant={getPriorityBadgeVariant(receit.priority)}>{receit.priority}</Badge>
             <div className="flex items-center gap-1">
                {categoryIcons[receit.category] || <Briefcase className="h-4 w-4" />}
                <span>{receit.category}</span>
             </div>
             <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                <span>{receit.effort} pts</span>
             </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-foreground">{receit.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          {linkedReceitObjects.length > 0 && (
            <div className="flex flex-col items-start gap-2">
                <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><LinkIcon size={14}/> Linked ReceITs</h4>
                <div className="flex flex-wrap gap-1">
                    {linkedReceitObjects.map(linked => (
                        <Badge key={linked.id} variant="secondary" className="font-normal">{linked.title}</Badge>
                    ))}
                </div>
            </div>
          )}
          <div className="flex justify-between w-full items-center">
             <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4"/>
                Due: {format(receit.dueDate, 'MMM d, yyyy')}
             </div>
             <div className="flex items-center space-x-2">
                <Checkbox id={`status-${receit.id}`} checked={receit.status === 'Done'} onCheckedChange={handleStatusChange} />
                <label
                  htmlFor={`status-${receit.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Done
                </label>
            </div>
          </div>
        </CardFooter>
      </Card>
      {isFormOpen && <ReceitForm open={isFormOpen} onOpenChange={setIsFormOpen} receit={receit} />}
    </>
  );
}
