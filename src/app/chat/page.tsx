"use client";

import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import InternalAdsPanel from "@/components/chat/InternalAdsPanel";

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen pt-16">
            <ChatSidebar
                onSelectConversation={setSelectedConversation}
                selectedId={selectedConversation?.id}
            />
            <ChatWindow conversation={selectedConversation} />
            {mounted && <InternalAdsPanel />}
        </div>
    );
}
