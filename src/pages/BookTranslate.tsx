import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Languages, ArrowRight, BookOpen, AlertCircle, Home } from "lucide-react";
import { toast } from "sonner";
import { preprocessFrenchText } from "@/lib/textUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { ServerScheduleDialog } from "@/components/ServerScheduleDialog";

const BookTranslate = () => {
  const [frenchText, setFrenchText] = useState("");
  const [mooreText, setMooreText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
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

  const wordCount = frenchText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isOverLimit = wordCount > 250;



  const translateText = async () => {
    if (!frenchText.trim()) {
      toast.error("Veuillez entrer du texte à traduire");
      return;
    }

    if (isOverLimit) {
      toast.error("Le texte dépasse la limite de 250 mots. Veuillez réduire la taille du texte.");
      return;
    }

    setIsTranslating(true);
    try {
      // Preprocess French text before translation
      const preprocessedText = preprocessFrenchText(frenchText);
      
      const response = await fetch("https://kzws1bwygca0tz-8000.proxy.runpod.net/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: preprocessedText,
          src_lang: "fra_Latn",
          tgt_lang: "mos_Latn",
          max_chunk_length: 80
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la traduction");
      }

      const data = await response.json();
      setMooreText(data.translated_text || data.text || "");
      toast.success("Traduction littéraire réussie !");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Erreur lors de la traduction");
    } finally {
      setIsTranslating(false);
    }
  };

  const clearText = () => {
    setFrenchText("");
    setMooreText("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="h-12 w-12 text-white" />
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Traduction Littéraire
              </h1>
            </div>
            <div className="text-2xl md:text-3xl text-white/90 mb-8 font-light">
              Français → Mooré
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Traduisez vos textes littéraires du français vers le mooré avec une précision optimisée pour les œuvres littéraires
            </p>
            
            {/* Back to Home Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Instructions */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              <strong>Traduction littéraire optimisée :</strong> Cette interface est spécialement conçue pour traduire des textes littéraires du français vers le mooré. 
              Pour une efficacité optimale, limitez chaque traduction à <strong>250 mots maximum</strong>.
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Languages className="h-5 w-5" />
                  Texte français à traduire
                </div>
                <div className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : wordCount > 200 ? 'text-amber-500' : 'text-green-600'}`}>
                  {wordCount}/250 mots
                </div>
              </div>
              
              <Textarea
                value={frenchText}
                onChange={(e) => setFrenchText(e.target.value)}
                placeholder="Entrez votre texte littéraire en français à traduire vers le mooré...

Exemple : Dans un petit village aux confins du Burkina Faso, vivait une vieille femme connue pour sa sagesse. Chaque soir, elle s'asseyait sous le grand baobab et racontait des histoires aux enfants du village."
                className={`min-h-48 resize-none border-border bg-background/50 focus:bg-background transition-colors ${isOverLimit ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              
              {isOverLimit && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Dépassement de la limite de 250 mots. Veuillez réduire le texte.
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  onClick={translateText} 
                  disabled={isTranslating || !frenchText.trim() || isOverLimit}
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-white font-medium"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traduction en cours...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Traduire vers le mooré
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={clearText}
                  variant="outline"
                  disabled={isTranslating}
                  className="px-6"
                >
                  Effacer
                </Button>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <BookOpen className="h-5 w-5" />
                Traduction en mooré
              </div>
              
              <div className="min-h-48 p-4 bg-muted/50 rounded-lg border">
                {mooreText ? (
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed text-lg">{mooreText}</p>
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        ✓ Traduction littéraire terminée
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground italic text-center">
                      La traduction littéraire en mooré apparaîtra ici...
                      <br />
                      <span className="text-sm">Entrez votre texte français et cliquez sur "Traduire vers le mooré"</span>
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="p-6 bg-gradient-card border-0 shadow-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Conseils pour une traduction littéraire optimale
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">📝 Préparation du texte</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Divisez les longs textes en passages de 250 mots maximum</li>
                  <li>Conservez les paragraphes et la structure narrative</li>
                  <li>Vérifiez l'orthographe et la ponctuation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">🎯 Optimisation</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Traduit spécialement les expressions littéraires</li>
                  <li>Préserve le style et le ton narratif</li>
                  <li>Adapte les références culturelles au contexte mooré</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Server Schedule Dialog */}
      <ServerScheduleDialog 
        open={showScheduleDialog} 
        onOpenChange={handleScheduleDialogClose} 
      />
    </div>
  );
};

export default BookTranslate;
