import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { GraduationCap, Loader2, AlertCircle } from "lucide-react";

export function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const normalizedIdentifier = identifier.trim().toUpperCase();
    
    if (!normalizedIdentifier) {
      setError("L’identifiant de connexion est obligatoire.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const user = await login(identifier);
      if (user.role === "admin") {
        navigate("/admin/tableau-de-bord");
      } else {
        navigate("/espace/tableau-de-bord");
      }
    } catch (err: any) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        setError("La connexion n’a pas pu être établie. Vérifiez votre connexion Internet puis réessayez.");
      } else {
        setError(err.message || "Identifiant incorrect ou non reconnu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-950">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center space-y-4">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg text-white">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Plateforme DDESTFP</h1>
            <p className="text-slate-400 text-sm mt-1">Connexion à l'espace établissement</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="identifier" className="block text-sm font-medium text-slate-300">
                    Identifiant de connexion
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Saisissez l’identifiant unique qui vous a été attribué par l’administrateur.
                  </p>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="Ex: LTP_LOKOSSA"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Vérification de votre identifiant…
                  </>
                ) : (
                  "Accéder à mon espace"
                )}
              </button>
            </form>
          </div>
          <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>Les identifiants sont attribués par l'administrateur de la DDESTFP.</p>
            <p className="mt-1">En cas de problème, veuillez contacter la direction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
