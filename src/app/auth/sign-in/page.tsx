"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SplitText = ({ children, ...rest }: { children: string; [key: string]: any }) => {
  const words = children.split(" ");
  return words.map((word, i) => (
    <span key={children + i} className="inline-block overflow-hidden">
      <motion.span {...rest} className="inline-block" custom={i}>
        {word + (i !== words.length - 1 ? "\u00A0" : "")}
      </motion.span>
    </span>
  ));
};

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Please enter both email and password.",
        });
        return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-in failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <Card className="mx-auto w-full max-w-md shadow-2xl border-0">
            <CardHeader className="text-center space-y-4">
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CardTitle className="text-4xl font-bold tracking-tighter sm:text-5xl">
                    <SplitText
                      initial={{ y: "100%" }}
                      animate="visible"
                      variants={{
                        visible: (i: number) => ({
                          y: 0,
                          transition: {
                            delay: i * 0.15,
                            duration: 0.8,
                            ease: [0.2, 0.65, 0.3, 0.9],
                          },
                        }),
                      }}
                    >
                      Welcome Back
                    </SplitText>
                  </CardTitle>
                </motion.div>
              </AnimatePresence>
              <CardDescription className="text-balance text-muted-foreground pt-2">
                Enter your credentials to access your sales dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 text-base"
                  />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={isLoading} 
                    className="h-11 text-base" 
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" onClick={handleSignIn} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Signing In..." : "Login"}
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Sales team collaboration"
          width="1080"
          height="1920"
          className="h-full w-full object-cover"
          data-ai-hint="collaboration business"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
    </div>
  );
}
