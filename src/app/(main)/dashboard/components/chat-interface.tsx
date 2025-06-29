"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Upload, File as FileIcon, X, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { summarizeSalesData } from "@/ai/flows/summarize-sales-data";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface Message {
  id: string;
  role: "user" | "bot";
  content: ReactNode;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      role: "bot",
      content:
        "Hello! Log your sales updates here: meeting notes, client feedback, new opportunities, performance metrics etc.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isProcessing) {
      setIsProcessing(true);
      const userMessage: Message = { id: `user-${Date.now()}`, role: "user", content: inputValue };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      
      const botMessageId = `bot-${Date.now()}`;
      setMessages((prev) => [...prev, {id: botMessageId, role: 'bot', content: <Loader2 className="h-5 w-5 animate-spin" />}]);

      try {
        const result = await summarizeSalesData({ chatLogs: inputValue });
        
        const { performanceMetrics, ...salesUpdateData } = result;

        // Save the general update
        await addDoc(collection(db, "sales_updates"), {
            ...salesUpdateData,
            rawText: inputValue,
            createdAt: serverTimestamp(),
        });

        // If performance metrics were extracted, save them to a separate collection
        if (performanceMetrics && Object.keys(performanceMetrics).length > 0) {
            await addDoc(collection(db, "performance_metrics"), {
                ...performanceMetrics,
                createdAt: serverTimestamp(),
            });
        }
        
        const botResponse = (
            <div className="space-y-2">
                <p className="font-bold">Update Logged & Analyzed:</p>
                <p>{result.summary}</p>
                {result.keyAchievements.length > 0 && (
                    <div>
                        <p className="font-semibold">Key Achievements:</p>
                        <ul className="list-disc list-inside">
                            {result.keyAchievements.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                )}
                {result.challenges.length > 0 && (
                    <div>
                        <p className="font-semibold">Challenges:</p>
                        <ul className="list-disc list-inside">
                            {result.challenges.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                )}
                {performanceMetrics && (
                    <div className="mt-2 text-xs italic text-muted-foreground/80">
                        Performance metrics were detected and saved to the dashboard.
                    </div>
                )}
            </div>
        );
        setMessages((prev) => prev.map(msg => msg.id === botMessageId ? {...msg, content: botResponse} : msg));

      } catch (error) {
          console.error("Failed to process sales data:", error);
          const errorResponse = "Sorry, I couldn't process that update. Please try again.";
          setMessages((prev) => prev.map(msg => msg.id === botMessageId ? {...msg, content: errorResponse} : msg));
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handleLogFile = () => {
    if (uploadedFile) {
        const userMessage: Message = { id: `user-file-${Date.now()}`, role: 'user', content: `Uploaded file: ${uploadedFile.name}`};
        const botResponse: Message = { id: `bot-file-${Date.now()}`, role: 'bot', content: 'File logged successfully. Thank you!'};
        setMessages((prev) => [...prev, userMessage, botResponse]);
        setUploadedFile(null);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };
  
  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div");
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-full min-h-[600px] bg-card/70 backdrop-blur-sm border-border/20 shadow-xl">
      <CardHeader>
        <CardTitle>Internal Sales Reporter</CardTitle>
        <CardDescription>
          Use this chat to log your sales activities. AI will analyze and store them.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs rounded-lg p-3 text-sm md:max-w-md prose prose-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4 flex-col">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Log Update</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="mt-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your update here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isProcessing}
              />
              <Button type="submit" onClick={handleSendMessage} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="file" className="mt-4">
            { !uploadedFile ? (
            <div
              onClick={handleDropzoneClick}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, PNG, JPG</p>
              </div>
              <Input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <FileIcon className="w-6 h-6 shrink-0 text-muted-foreground" />
                           <span className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setUploadedFile(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button onClick={handleLogFile} className="w-full">
                        Log File
                    </Button>
                </div>
            )}
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  );
}
