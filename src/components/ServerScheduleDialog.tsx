import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, Server } from "lucide-react";

interface ServerScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServerScheduleDialog({ open, onOpenChange }: ServerScheduleDialogProps) {
  const getCurrentGMTTime = () => {
    const now = new Date();
    return now.toISOString().substring(11, 16); // Format HH:MM
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Serveur présentement indisponible revenez prochainement pour vérifier la disponibilité
            </AlertDialogTitle>
          </div>
          
          <AlertDialogDescription className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">
                Serveur actuellement indisponible
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Heure GMT actuelle : <span className="font-mono font-medium">{getCurrentGMTTime()}</span>
                </span>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-red-800">
                    ⚠️ Service temporairement indisponible
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    Veuillez revenir ultérieurement
                  </p>
                </div>
              </div>
              
            
        
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white w-full">
            J'ai compris
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
