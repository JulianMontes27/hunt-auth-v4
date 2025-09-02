"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { Shield, Phone, Plus, Loader2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PhoneVerificationManagerProps {
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
}

const countryCodes = [
  { code: "+57", country: "CO", flag: "🇨🇴" },
  // { code: "+1", country: "US/CA", flag: "🇺🇸" },
  // { code: "+44", country: "UK", flag: "🇬🇧" },
  // { code: "+49", country: "DE", flag: "🇩🇪" },
  // { code: "+33", country: "FR", flag: "🇫🇷" },
  // { code: "+34", country: "ES", flag: "🇪🇸" },
  // { code: "+39", country: "IT", flag: "🇮🇹" },
  // { code: "+52", country: "MX", flag: "🇲🇽" },
  // { code: "+55", country: "BR", flag: "🇧🇷" },
  // { code: "+91", country: "IN", flag: "🇮🇳" },
  // { code: "+86", country: "CN", flag: "🇨🇳" },
  // { code: "+81", country: "JP", flag: "🇯🇵" },
  // { code: "+82", country: "KR", flag: "🇰🇷" },
];

export function PhoneVerificationManager({
  phoneNumber,
  phoneNumberVerified,
}: PhoneVerificationManagerProps) {
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRemovingPhone, setIsRemovingPhone] = useState(false);

  const [countryCode, setCountryCode] = useState("+57");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("");

  const router = useRouter();

  // Timer for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatPhoneNumber = (phone: string) => {
    // Handle international phone numbers properly
    if (!phone) return phone;

    // If it already starts with +, it's international format - just return as is
    if (phone.startsWith("+")) {
      return phone;
    }

    // Otherwise, try to format as US phone number
    if (phone.length >= 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    // Check if it's a valid length (7-15 digits)
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  const handleSendOTP = async () => {
    const fullPhoneNumber = countryCode + phoneInput.replace(/\D/g, "");

    if (!validatePhoneNumber(phoneInput)) {
      toast.error("Por favor ingresa un número de teléfono válido");
      return;
    }

    setIsSendingOTP(true);
    try {
      // Auth Client (Better-Auth) communicates with the Server to send the OTP code
      await authClient.phoneNumber.sendOtp({
        phoneNumber: fullPhoneNumber,
      });

      toast.success("¡Código de verificación enviado!");
      setPendingPhoneNumber(fullPhoneNumber);
      setResendTimer(60); // 60 second cooldown
      setShowVerifyDialog(true);
      setShowAddDialog(false);
    } catch (error: unknown) {
      console.error("Failed to send OTP:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al enviar el código de verificación. Por favor intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  // New function for verifying existing phone numbers (from signup)
  const handleSendOTPExisting = async (existingPhoneNumber: string) => {
    setIsSendingOTP(true);
    try {
      const response = await fetch("/api/auth/verify-existing-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send",
          phoneNumber: existingPhoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al enviar el código de verificación"
        );
      }

      toast.success("¡Código de verificación enviado!");
      setPendingPhoneNumber(existingPhoneNumber);
      setResendTimer(60); // 60 second cooldown
      setShowVerifyDialog(true);
    } catch (error: unknown) {
      console.error("Failed to send OTP:", error);
      toast.error(
        "Error al enviar el código de verificación. Por favor intenta de nuevo."
      );
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error("Por favor ingresa el código de verificación de 6 dígitos");
      return;
    }

    setIsVerifyingOTP(true);
    try {
      // Check if this is an existing phone number (from signup) or a new one
      const isExistingPhone = pendingPhoneNumber === phoneNumber;

      if (isExistingPhone) {
        // Use custom verification for existing phone numbers
        const response = await fetch("/api/auth/verify-existing-phone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "verify",
            phoneNumber: pendingPhoneNumber,
            code: otpCode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Código de verificación inválido");
        }
      } else {
        // Use Better Auth for new phone numbers
        await authClient.phoneNumber.verify({
          phoneNumber: pendingPhoneNumber,
          code: otpCode,
          disableSession: true,
          updatePhoneNumber: true,
        });
      }

      toast.success("¡Número de teléfono verificado exitosamente!");

      // Reset states
      setOtpCode("");
      setShowVerifyDialog(false);
      setPendingPhoneNumber("");
      setPhoneInput("");

      // Refresh the page to show updated data
      router.refresh();
    } catch (error: unknown) {
      console.error("Failed to verify OTP:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Código de verificación inválido. Por favor intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsSendingOTP(true);
    try {
      // Check if this is an existing phone number (from signup) or a new one
      const isExistingPhone = pendingPhoneNumber === phoneNumber;

      if (isExistingPhone) {
        // Use custom resend for existing phone numbers
        const response = await fetch("/api/auth/verify-existing-phone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "send",
            phoneNumber: pendingPhoneNumber,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Error al reenviar el código de verificación"
          );
        }
      } else {
        // Use Better Auth for new phone numbers
        await authClient.phoneNumber.sendOtp({
          phoneNumber: pendingPhoneNumber,
        });
      }

      toast.success("¡Nuevo código de verificación enviado!");
      setResendTimer(60);
    } catch (error: unknown) {
      console.error("Failed to resend OTP:", error);
      toast.error("Error al reenviar el código. Por favor intenta de nuevo.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleRemovePhone = async () => {
    setIsRemovingPhone(true);
    try {
      // Note: Better Auth doesn't have a direct "remove phone" method
      // You might need to implement this as a custom endpoint
      // For now, this is a placeholder
      toast.info("Función de eliminación de teléfono próximamente");
    } catch (error: unknown) {
      console.error("Failed to remove phone:", error);
      toast.error(
        "Error al eliminar el número de teléfono. Por favor intenta de nuevo."
      );
    } finally {
      setIsRemovingPhone(false);
    }
  };

  const resetDialogs = () => {
    setShowAddDialog(false);
    setShowVerifyDialog(false);
    setPhoneInput("");
    setOtpCode("");
    setPendingPhoneNumber("");
    setResendTimer(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#A0A0A0]">
            Número de Teléfono
          </h3>
          <p className="text-sm text-muted-foreground">
            Agrega y verifica tu número de teléfono para mayor seguridad
          </p>
        </div>

        {!phoneNumber && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Teléfono
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#171717] border border-[#292929]">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Agregar Número de Teléfono
                </DialogTitle>
                <DialogDescription className="text-[#7A7A7A]">
                  Ingresa tu número de teléfono para recibir códigos de
                  verificación.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="country-code" className="text-[#A0A0A0]">
                    Código de País
                  </Label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="bg-[#242424] border border-[#424242] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1d1d1d] border border-[#424242]">
                      {countryCodes.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.code}
                          className="text-white hover:bg-[#242424]"
                        >
                          {country.flag} {country.code} {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone-number" className="text-[#A0A0A0]">
                    Número de Teléfono
                  </Label>
                  <Input
                    id="phone-number"
                    placeholder="3214567890"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="bg-[#242424] border border-[#424242] text-white placeholder:text-[#7A7A7A]"
                    disabled={isSendingOTP}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={resetDialogs}
                  disabled={isSendingOTP}
                  className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d]"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || !phoneInput.trim()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {isSendingOTP ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Código"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Current Phone Status */}
      {phoneNumber ? (
        <div className="flex items-center justify-between p-4 rounded-lg border border-[#424242] bg-[#242424]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#1d1d1d] flex items-center justify-center">
              <Phone className="h-5 w-5 text-[#7A7A7A]" />
            </div>
            <div>
              <p className="font-medium text-white">
                {formatPhoneNumber(phoneNumber)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                {phoneNumberVerified ? (
                  <Badge
                    variant="default"
                    className="bg-green-600 text-white text-xs"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-yellow-500/30 text-yellow-400 text-xs"
                  >
                    Verificación Pendiente
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!phoneNumberVerified && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendOTPExisting(phoneNumber)}
                disabled={isSendingOTP}
                className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:text-white"
              >
                {isSendingOTP ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Verificar"
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemovePhone}
              disabled={isRemovingPhone}
              className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
            >
              {isRemovingPhone ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-[#424242] rounded-lg">
          <Phone className="h-12 w-12 text-[#7A7A7A] mx-auto mb-4" />
          <p className="text-[#7A7A7A] mb-2">
            No hay número de teléfono agregado
          </p>
          <p className="text-sm text-muted-foreground">
            Agrega tu número de teléfono para notificaciones SMS y mayor
            seguridad
          </p>
        </div>
      )}

      {/* OTP Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="bg-[#171717] border border-[#292929]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Verificar Número de Teléfono
            </DialogTitle>
            <DialogDescription className="text-[#7A7A7A]">
              Ingresa el código de 6 dígitos enviado a{" "}
              {formatPhoneNumber(pendingPhoneNumber)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp-code" className="text-[#A0A0A0]">
                Código de Verificación
              </Label>
              <Input
                id="otp-code"
                placeholder="123456"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="bg-[#242424] border border-[#424242] text-white placeholder:text-[#7A7A7A] text-center text-lg tracking-widest"
                disabled={isVerifyingOTP}
                maxLength={6}
              />
            </div>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || isSendingOTP}
                className="text-[#7A7A7A] hover:text-white"
              >
                {resendTimer > 0
                  ? `Reenviar en ${resendTimer}s`
                  : "Reenviar Código"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={resetDialogs}
              disabled={isVerifyingOTP}
              className="bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleVerifyOTP}
              disabled={isVerifyingOTP || otpCode.length !== 6}
              className="bg-white text-black hover:bg-gray-200"
            >
              {isVerifyingOTP ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Verificar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
