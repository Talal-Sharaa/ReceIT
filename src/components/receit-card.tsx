"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useReceits } from "@/lib/receit-context";
import type { Receit } from "@/lib/types";
import { Briefcase, Calendar, Edit, Hash, Link as LinkIcon, Megaphone, MoreVertical, Trash2, User, Trash, MessageSquarePlus } from "lucide-react";
import { format } from 'date-fns';
import { ReceitForm } from './receit-form';
import { Separator } from './ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ReceitCardProps = {
  receit: Receit;
  isParent: boolean;
  highlighted: string[];
  setHighlighted: (ids: string[]) => void;
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

export function ReceitCard({ receit, isParent, highlighted, setHighlighted }: ReceitCardProps) {
  const { updateReceit, deleteReceit, getReceitById } = useReceits();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleStatusChange = (checked: boolean) => {
    updateReceit({ ...receit, status: checked ? 'Done' : 'To-Do' });
  };

  const handleDelete = () => {
    deleteReceit(receit.id);
  };
  
  const handleDeleteWithLinked = () => {
    deleteReceit(receit.id, true);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...(receit.notes || []), newNote.trim()];
      updateReceit({ ...receit, notes: updatedNotes });
      setNewNote('');
    }
  };

  const linkedReceitObjects = receit.linkedReceits.map(id => getReceitById(id)).filter(Boolean) as Receit[];

  return (
    <>
      <TooltipProvider>
        <Card 
          id={`receit-${receit.id}`}
          className={`flex flex-col h-full font-code shadow-none border-none bg-transparent transition-all duration-300 ${highlighted.includes(receit.id) ? 'bg-accent/50 ring-2 ring-primary' : ''}`}
        >
          <div className="bg-card rounded-t-lg receipt-edge p-6 flex items-start justify-between">
              <div>
                  <CardTitle className="font-code text-2xl mb-2">{receit.title}</CardTitle>
                  <CardDescription className="text-xs">
                      ID: {receit.id.substring(0,8)}
                  </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {linkedReceitObjects.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 flex-shrink-0"
                        onMouseEnter={() => setHighlighted(linkedReceitObjects.map(l => l.id))}
                        onMouseLeave={() => setHighlighted([])}
                        >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-sans text-sm font-medium">Linked to:</p>
                      <ul className="list-disc pl-4 font-sans text-xs">
                        {linkedReceitObjects.map(linked => (
                          <li key={linked.id}>{linked.title}</li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                )}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                   {isParent && (
                    <DropdownMenuItem onClick={handleDeleteWithLinked} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete with Linked</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
          <div className="bg-card receipt-edge px-6 py-4 space-y-4">
              <p className="text-sm text-foreground min-h-[40px]">{receit.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <Badge variant={getPriorityBadgeVariant(receit.priority)}>{receit.priority} Priority</Badge>
                  <div className="flex items-center gap-1">
                      {categoryIcons[receit.category] || <Briefcase className="h-4 w-4" />}
                      <span>{receit.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      <span>{receit.effort} pts</span>
                  </div>
              </div>
          </div>
          <Separator className="border-dashed border-2" />
          <div className="bg-card receipt-edge p-6 space-y-4">
            <h4 className="text-sm font-semibold">Notes</h4>
            <div className="space-y-2">
              {receit.notes && receit.notes.length > 0 ? (
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                  {receit.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Add a note..." 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                className="h-8 text-xs"
              />
              <Button size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleAddNote}>
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator className="border-dashed border-2" />
          <div className="bg-card rounded-b-lg receipt-edge p-6 flex justify-between w-full items-center">
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
        </Card>
      </TooltipProvider>
      {isFormOpen && <ReceitForm open={isFormOpen} onOpenChange={setIsFormOpen} receit={receit} />}
    </>
  );
}
