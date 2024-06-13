"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/assets/icons";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { useAddConvo } from "@/hooks/useAddConvo";
import { useFetchConvos } from "@/hooks/useFetchConvos";
import { useWorkspaceData } from "@/hooks/useWorkspaceData";

import { SearchBox } from "./SearchBox";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { Convo } from "@/lib/types/interfaces";
import { ChatOptionButton } from "./ChatOptionButton";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";

interface ChatSidebarProps {}

export function ChatSidebar({}: ChatSidebarProps) {
    const router = useRouter();

    const {
        data: convos = [],
        isLoading: isConvoLoading,
        isSuccess: isConvoSuccess,
        error: convoError,
    } = useFetchConvos();
    const { workspaceData, isWorkspaceSuccess } = useWorkspaceData();
    const { addChat: addConvo, isPending: isAddingConvo } = useAddConvo();

    const [todayConvos, setTodayConvos] = React.useState<Convo[]>([]);
    const [previousConvos, setPreviousConvos] = React.useState<Convo[]>([]);

    const [searchQuery, setSearchQuery] = React.useState("");
    const debounceValue = useDebounce(searchQuery, 1000);
    const [rename, setRename] = React.useState<number | null>(null);
    const [toggleOptions, setToggleOptions] = React.useState<number | null>(null);

    const isTodayConvo = (convo: Convo) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const convoDate = new Date(convo.created_at);
        convoDate.setHours(0, 0, 0, 0);
        return convoDate.getTime() === today.getTime() && !convo.archived;
    };

    const isPreviousConvo = (convo: Convo) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const convoDate = new Date(convo.created_at);
        convoDate.setHours(0, 0, 0, 0);
        return convoDate.getTime() !== today.getTime() && !convo.archived;
    };

    React.useEffect(() => {
        if (isConvoSuccess) {
            const todayConvoList = convos.filter(isTodayConvo);
            const previousConvoList = convos.filter(isPreviousConvo);

            setTodayConvos(todayConvoList);
            setPreviousConvos(previousConvoList);
        }
    }, [convos, isConvoSuccess]);

    const handleAddChat = async () => {
        try {
            await addConvo();
        } catch (error) {
            console.error("Error adding convo:", error);
        }
    };

    const handleSearch = () => {
        const filteredConvos = convos.filter((convo: Convo) =>
            convo.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setTodayConvos(filteredConvos.filter(isTodayConvo));
        setPreviousConvos(filteredConvos.filter(isPreviousConvo));
    };

    React.useEffect(() => {
        handleSearch();
    }, [debounceValue]);

    const handleConvoClick = (convoId: number) => {
        router.push(`/chat/${convoId}`);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div
                    className={cn(
                        buttonVariants({ variant: "secondary" }),
                        `h-fit p-1 cursor-pointer hover:bg-muted-foreground/10`,
                    )}
                >
                    <Icons.solarHambugerMenuLine className="h-7 w-7 bg-transparent" />
                    <span className="sr-only">Close</span>
                </div>
            </SheetTrigger>

            <SheetContent
                side={"left"}
                className="rounded-xl max-sm:rounded-l-none sm:w-96 max-w-96  sm:h-[calc(100%-2rem)] sm:left-16 sm:top-4 "
                overlayClassName="bg-black/50 backdrop-blur-sm"
            >
                <div className="space-y-1">
                    <SheetTitle className="font-mainhead font-bold text-2xl leading-none">
                        {workspaceData ? workspaceData.business_name : "Workspace"}
                    </SheetTitle>
                    <SheetDescription className="text-[13px] leading-none ">
                        Smart decisions start now.
                    </SheetDescription>
                </div>
                <div className="my-4 space-y-4">
                    <Button
                        onClick={handleAddChat}
                        disabled={isAddingConvo}
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full h-10 rounded-xl bg-background flex justify-center items-center  gap-[8px] focus-visible:ring-0 border-blue-500 hover:bg-blue-50 text-blue-500 hover:text-blue-600",
                        )}
                    >
                        <Icons.solarMagicStickLine className="h-5 w-5" />
                        <span>New chat</span>
                    </Button>
                    <Separator className="w-full" />
                    <SearchBox
                        type="text"
                        placeholder="Search a chat…"
                        className="w-full h-10 rounded-xl bg-background "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="h-[552px] overflow-auto small-scrollbar ">
                    {isConvoLoading ? (
                        <>
                            <div className="space-y-2 opacity-50">
                                <Skeleton className="w-2/4 h-7 mb-4" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                            </div>
                            <div className="space-y-2 mt-4 opacity-50">
                                <Skeleton className="w-2/4 h-7 mb-4" />

                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                                <Skeleton className="w-full h-7" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <div>
                                    <span className="text-muted-foreground text-[10px]">TODAY</span>
                                </div>
                                {todayConvos.map((chat) => {
                                    return (
                                        <ChatOptionButton
                                            onClick={() => handleConvoClick(chat.id)}
                                            key={chat.id}
                                            chat={chat}
                                            toggleOptions={toggleOptions}
                                            setToggleOptions={setToggleOptions}
                                            rename={rename}
                                            setRename={setRename}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                <div>
                                    <span className="text-muted-foreground text-[10px]">
                                        PREVIOUS 7 DAYS
                                    </span>
                                </div>
                                {previousConvos.map((chat) => {
                                    return (
                                        <ChatOptionButton
                                            onClick={() => handleConvoClick(chat.id)}
                                            key={chat.id}
                                            chat={chat}
                                            toggleOptions={toggleOptions}
                                            setToggleOptions={setToggleOptions}
                                            rename={rename}
                                            setRename={setRename}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
