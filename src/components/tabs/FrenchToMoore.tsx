import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Volume2, Languages, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { preprocessFrenchText } from "@/lib/textUtils";

export function FrenchToMoore() {
  const [frenchText, setFrenchText] = useState("");
  const [mooreText, setMooreText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const translateText = async () => {
    if (!frenchText.trim()) {
      toast.error("Veuillez entrer du texte à traduire");
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
      toast.success("Traduction réussie !");
      
      // Auto-generate audio after translation
      if (data.translated_text || data.text) {
        await synthesizeAudio(data.translated_text || data.text);
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Erreur lors de la traduction");
    } finally {
      setIsTranslating(false);
    }
  };

  const synthesizeAudio = async (text: string) => {
    setIsSynthesizing(true);
    try {
      const response = await fetch("https://lj5h4w1tq3dj49-8080.proxy.runpod.net/inference/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          reference_speaker: "ref_male_17.wav"
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la synthèse vocale");
      }

      const data = await response.json();
      if (data.success && data.audio_url) {
        // Pour la nouvelle structure de réponse, utiliser l'endpoint de download
        const fullAudioUrl = `https://lj5h4w1tq3dj49-8080.proxy.runpod.net/tts/download/${data.audio_url}`;
        setAudioUrl(fullAudioUrl);
        toast.success(`Audio généré avec succès ! Durée: ${data.duration_seconds?.toFixed(1)}s`);
      } else if (data.audio_url) {
        // Compatibilité avec l'ancienne structure
        const fullAudioUrl = `https://lj5h4w1tq3dj49-8080.proxy.runpod.net${data.audio_url}`;
        setAudioUrl(fullAudioUrl);
        toast.success("Audio généré avec succès !");
      }
    } catch (error) {
      console.error("TTS error:", error);
      toast.error("Erreur lors de la synthèse vocale");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("Erreur lors de la lecture audio");
      };
      audio.play().catch(() => {
        setIsPlaying(false);
        toast.error("Impossible de lire l'audio");
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-3">Français vers Mooré</h2>
        <p className="text-muted-foreground text-lg">
          Traduisez du français vers le mooré et écoutez la prononciation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Languages className="h-5 w-5" />
            Texte en français
          </div>
          <Textarea
            value={frenchText}
            onChange={(e) => setFrenchText(e.target.value)}
            placeholder="Entrez votre texte en français..."
            className="min-h-32 resize-none border-border bg-background/50 focus:bg-background transition-colors"
          />
          <Button 
            onClick={translateText} 
            disabled={isTranslating || !frenchText.trim()}
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
          <div className="flex items-center gap-2 text-secondary font-semibold">
            <Languages className="h-5 w-5" />
            Texte en mooré
          </div>
          <div className="min-h-32 p-3 bg-muted/50 rounded-lg border">
            {mooreText ? (
              <p className="text-foreground leading-relaxed">{mooreText}</p>
            ) : (
              <p className="text-muted-foreground italic">La traduction apparaîtra ici...</p>
            )}
          </div>
          
          {/* Audio Section */}
          <div className="space-y-3">
            {isSynthesizing && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération de l'audio...
              </div>
            )}
            
            {audioUrl && (
              <Button
                onClick={playAudio}
                disabled={isPlaying}
                variant="secondary"
                className="w-full bg-secondary hover:bg-secondary/90 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lecture en cours...
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-4 w-4" />
                    Écouter la prononciation
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}