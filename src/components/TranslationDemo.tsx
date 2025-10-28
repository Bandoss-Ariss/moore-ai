import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FrenchToMoore } from "./tabs/FrenchToMoore";
import { MooreToFrench } from "./tabs/MooreToFrench";
import { SpeechToText } from "./tabs/SpeechToText";
import { ServerScheduleDialog } from "./ServerScheduleDialog";
import { Languages, Mic, ArrowLeftRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function TranslationDemo() {
  const [activeTab, setActiveTab] = useState("fr-to-mo");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show schedule dialog on page load
    // Check if user has already seen the schedule notice today
    const currentDate = new Date();
    const today = currentDate.toDateString();
    const lastSeenSchedule = localStorage.getItem('scheduleNoticeSeenDate');
    
    // Only show dialog if not seen today
    if (lastSeenSchedule !== today) {
      setShowScheduleDialog(true);
    }
  }, []);

  const handleScheduleDialogClose = (open: boolean) => {
    setShowScheduleDialog(open);
    if (!open) {
      // Mark as seen for today
      const today = new Date().toDateString();
      localStorage.setItem('scheduleNoticeSeenDate', today);
    }
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Modèles de traduction Mooré
            </h1>
            <div className="text-2xl md:text-3xl text-white/90 mb-8 font-light">
              TTT • TTS • ASR  By GO AI CORP
            </div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Découvrez les modèles de traduction pour le Mooré
            </p>
            
            {/* Navigation Button to Book Translate */}
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/book_translate")}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Traduction Littéraire
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white/20 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-16 bg-gradient-card shadow-elevated rounded-2xl p-2">
              <TabsTrigger 
                value="fr-to-mo" 
                className="flex items-center gap-3 text-base font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow"
              >
                <Languages className="h-5 w-5" />
                FR → Mooré
              </TabsTrigger>
              <TabsTrigger 
                value="mo-to-fr" 
                className="flex items-center gap-3 text-base font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow"
              >
                <ArrowLeftRight className="h-5 w-5" />
                Mooré → FR
              </TabsTrigger>
              <TabsTrigger 
                value="stt" 
                className="flex items-center gap-3 text-base font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow"
              >
                <Mic className="h-5 w-5" />
                Speech to Text
              </TabsTrigger>
            </TabsList>

            <Card className="bg-gradient-card shadow-elevated border-0 rounded-3xl overflow-hidden">
              <TabsContent value="fr-to-mo" className="p-8 animate-scale-in">
                <FrenchToMoore />
              </TabsContent>
              
              <TabsContent value="mo-to-fr" className="p-8 animate-scale-in">
                <MooreToFrench />
              </TabsContent>
              
              <TabsContent value="stt" className="p-8 animate-scale-in">
                <SpeechToText />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
      
      {/* Server Schedule Dialog */}
      <ServerScheduleDialog 
        open={showScheduleDialog} 
        onOpenChange={handleScheduleDialogClose} 
      />
    </div>
  );
}