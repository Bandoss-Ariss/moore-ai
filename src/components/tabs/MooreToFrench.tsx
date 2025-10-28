import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Languages, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function MooreToFrench() {
  const [mooreText, setMooreText] = useState("");
  const [frenchText, setFrenchText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = async () => {
    if (!mooreText.trim()) {
      toast.error("Veuillez entrer du texte à traduire");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("https://kzws1bwygca0tz-8000.proxy.runpod.net/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: mooreText,
          src_lang: "mos_Latn",
          tgt_lang: "fra_Latn",
          max_chunk_length: 80
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la traduction");
      }

      const data = await response.json();
      setFrenchText(data.translated_text || data.text || "");
      toast.success("Traduction réussie !");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Erreur lors de la traduction");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-3">Mooré vers Français</h2>
        <p className="text-muted-foreground text-lg">
          Traduisez du mooré vers le français
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center gap-2 text-secondary font-semibold">
            <Languages className="h-5 w-5" />
            Texte en mooré
          </div>
          <Textarea
            value={mooreText}
            onChange={(e) => setMooreText(e.target.value)}
            placeholder="Sõngr tɩ m mooré yãmb bãng..."
            className="min-h-32 resize-none border-border bg-background/50 focus:bg-background transition-colors"
          />
          <Button 
            onClick={translateText} 
            disabled={isTranslating || !mooreText.trim()}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-white font-medium"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traduction en cours...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Traduire
              </>
            )}
          </Button>
        </Card>

        {/* Output Section */}
        <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Languages className="h-5 w-5" />
            Texte en français
          </div>
          <div className="min-h-32 p-3 bg-muted/50 rounded-lg border">
            {frenchText ? (
              <p className="text-foreground leading-relaxed">{frenchText}</p>
            ) : (
              <p className="text-muted-foreground italic">La traduction apparaîtra ici...</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}