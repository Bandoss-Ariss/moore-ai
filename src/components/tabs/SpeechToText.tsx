import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mic, Square, Upload, Languages, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Enregistrement démarré");
    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Impossible d'accéder au microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Enregistrement terminé");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      toast.success("Fichier audio sélectionné");
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error("Aucun fichier audio disponible");
      return;
    }

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'audio.wav');

      const response = await fetch("https://lj5h4w1tq3dj49-8080.proxy.runpod.net/transcribe/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la transcription");
      }

      const data = await response.json();
      const transcribed = data.translated_text || data.text || data.transcription || "";
      setTranscribedText(transcribed);
      toast.success("Transcription réussie !");
      
      // Auto-translate after transcription
      if (transcribed) {
        await translateTranscribedText(transcribed);
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erreur lors de la transcription");
    } finally {
      setIsTranscribing(false);
    }
  };

  const translateTranscribedText = async (text: string) => {
    setIsTranslating(true);
    try {
      const response = await fetch("https://kzws1bwygca0tz-8000.proxy.runpod.net/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          src_lang: "mos_Latn",
          tgt_lang: "fra_Latn",
          max_chunk_length: 80
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la traduction");
      }

      const data = await response.json();
      setTranslatedText(data.translated_text || data.text || "");
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
        <h2 className="text-3xl font-bold text-foreground mb-3">Speech to Text(Articulez bien svp)</h2>
        <p className="text-muted-foreground text-lg">
          Enregistrez ou importez un audio en mooré pour le transcrire et traduire
        </p>
      </div>

      {/* Recording Section */}
      <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
        <div className="flex items-center gap-2 text-accent font-semibold mb-4">
          <Mic className="h-5 w-5" />
          Enregistrement audio
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            className={`flex-1 ${!isRecording ? 'bg-gradient-primary hover:opacity-90 text-white shadow-glow' : ''}`}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Arrêter l'enregistrement
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Commencer l'enregistrement
              </>
            )}
          </Button>

          <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importer un fichier
          </Button>
        </div>

        {audioBlob && (
          <div className="mt-4">
            <Button
              onClick={transcribeAudio}
              disabled={isTranscribing}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-white font-medium"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcription en cours...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Transcrire l'audio
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Transcription Result */}
        <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center gap-2 text-secondary font-semibold">
            <Languages className="h-5 w-5" />
            Transcription (Mooré)
          </div>
          <div className="min-h-32 p-3 bg-muted/50 rounded-lg border">
            {transcribedText ? (
              <p className="text-foreground leading-relaxed">{transcribedText}</p>
            ) : (
              <p className="text-muted-foreground italic">La transcription apparaîtra ici...</p>
            )}
          </div>
        </Card>

        {/* Translation Result */}
        <Card className="p-6 space-y-4 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Languages className="h-5 w-5" />
            Traduction (Français)
          </div>
          <div className="min-h-32 p-3 bg-muted/50 rounded-lg border">
            {isTranslating ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Traduction en cours...
              </div>
            ) : translatedText ? (
              <p className="text-foreground leading-relaxed">{translatedText}</p>
            ) : (
              <p className="text-muted-foreground italic">La traduction apparaîtra ici...</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}