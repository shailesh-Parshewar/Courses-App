"use client";
import { ReactNode, useId, useOptimistic, useTransition } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import { ActionToast } from "./ui/sonner";

const SortableList = <T extends { id: string }>({
    items,
    onOrderChange,
    children
}: {
    items: T[],
    onOrderChange: (newOrder: string[]) => Promise<{ error: boolean, message: string }>,
    children: (items: T[]) => ReactNode
}) => { 
   const dndContextId = useId();
    const [optimisticItems, setOptimisticItems] = useOptimistic(items);
    const [, startTransition] = useTransition();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = active.id.toString();
        const overId = over?.id.toString();

        if (overId == null || activeId == null) return;
        function getNewArray(items: T[], activeId: string, overId: string) {
            const oldIndex = items.findIndex(section => section.id === activeId);
            const newIndex = items.findIndex(section => section.id === overId);

            return arrayMove(items, oldIndex, newIndex)
        }
        startTransition(async () => {
            setOptimisticItems(items => getNewArray(items, activeId, overId))
            const actionData = await
                onOrderChange(getNewArray(optimisticItems, activeId, overId).map(s => s.id));

            ActionToast({ actionData })
        })
    };

    return (
        <DndContext id={dndContextId} onDragEnd={handleDragEnd}>
            <SortableContext items={optimisticItems} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col">
                    {children(optimisticItems)}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default SortableList;

export function SortableItem({
    id,
    children,
    className }: {
        id: string,
        children: ReactNode,
        className?: string
    }) {

    const {
        setNodeRef,
        transform,
        transition,
        activeIndex,
        index,
        attributes,
        listeners
    } = useSortable({ id });

    const isActive = activeIndex === index
    return (
        <div ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition
            }}
            className={cn("flex items-center gap-1 bg-background rounded-lg p-2",
                isActive && "z-10 border shadow-md", className)}
        >
            <GripVerticalIcon
                className="text-muted-foreground size-6 p-1"
                {...attributes}
                {...listeners} />
            <div className={cn("flex-grow", className)} >
                {children}
            </div>
        </div>
    )

}