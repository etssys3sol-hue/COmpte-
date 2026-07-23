import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { GraduationCap, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [loginType, setLoginType] = useState<"establishment" | "admin">("establishment");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginEstablishment, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleEstablishmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      await loginEstablishment(identifier);
      navigate("/espace/tableau-de-bord", { replace: true });
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : "La connexion a échoué."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await loginAdmin(email, password);
      navigate("/admin/tableau-de-bord", { replace: true });
    } catch (err: any) {
      setError(err.message || "Identifiants administrateur incorrects.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-950">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center space-y-4">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg text-white">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Plateforme DDESTFP</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {loginType === "establishment" ? "Connexion à l'espace établissement" : "Connexion Administrateur"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setLoginType("establishment"); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                loginType === "establishment"
                  ? "bg-slate-800 text-emerald-400 border-b-2 border-emerald-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              Établissement
            </button>
            <button
              onClick={() => { setLoginType("admin"); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                loginType === "admin"
                  ? "bg-slate-800 text-emerald-400 border-b-2 border-emerald-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              Administrateur
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {loginType === "establishment" ? (
              <form onSubmit={handleEstablishmentSubmit} className="space-y-6">
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
                      name="identifier"
                      type="text"
                      value={identifier}
                      minLength={7}
                      maxLength={7}
                      autoComplete="off"
                      spellCheck={false}
                      disabled={isSubmitting}
                      required
                      onChange={(event) =>
                        setIdentifier(
                          event.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 7),
                        )
                      }
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 font-mono tracking-wider"
                      placeholder="Ex: EST1234"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || identifier.length !== 7}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connexion en cours…
                    </>
                  ) : (
                    "Accéder à mon espace"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                      Adresse électronique
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                      placeholder="admin@ddestfp.bj"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-12 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
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
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>
            )}
          </div>
          
          {loginType === "establishment" && (
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              <p>Les identifiants sont attribués par l'administrateur de la DDESTFP.</p>
              <p className="mt-1">En cas de problème, veuillez contacter la direction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
