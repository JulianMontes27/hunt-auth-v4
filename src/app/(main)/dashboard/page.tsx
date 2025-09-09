import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneVerificationManager } from "@/components/dashboard/PhoneVerificationManager";
// import { PasskeyManager } from "@/components/dashboard/PasskeyManager";
import { db } from "@/db/drizzle";
import {
  user as userSchema,
  session as sessionSchema,
  account as accountSchema,
  passkey as passkeySchema,
  paymentProcessorAccount as paymentProcessorAccountSchema,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import {
  User,
  Mail,
  Shield,
  Key,
  Clock,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import CustomizableAvatar from "@/components/dashboard/CustomizableAvatar";
import { redirect } from "next/navigation";
import api from "@/lib/mp-api";

// Queremos que esta página sea dinámica para saber el estado del marketplace
export const dynamic = "force-dynamic";

async function getUserData() {
  // Check for auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return redirect("/sign-in");
  }

  // Execute all queries in parallel for better performance
  // getUserData function optimization:
  // Changed from 4 sequential database queries to parallel execution using Promise.all
  // Reduced database round-trips from ~4 to 1 concurrent batch
  // Added payment processor accounts query
  const [
    userData,
    userSessions,
    userAccounts,
    userPasskeys,
    paymentProcessorAccounts,
  ] = await Promise.all([
    db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, session.user.id))
      .limit(1),

    db
      .select()
      .from(sessionSchema)
      .where(eq(sessionSchema.userId, session.user.id))
      .orderBy(sessionSchema.createdAt),

    db
      .select()
      .from(accountSchema)
      .where(eq(accountSchema.userId, session.user.id)),

    db
      .select()
      .from(passkeySchema)
      .where(eq(passkeySchema.userId, session.user.id))
      .orderBy(passkeySchema.createdAt),

    db
      .select()
      .from(paymentProcessorAccountSchema)
      .where(eq(paymentProcessorAccountSchema.userId, session.user.id))
      .orderBy(paymentProcessorAccountSchema.createdAt),
  ]);

  return {
    user: userData[0] || null,
    sessions: userSessions,
    accounts: userAccounts,
    passkeys: userPasskeys,
    paymentProcessorAccounts,
  };
}

export default async function ProfilePage() {
  const data = await getUserData();
  const { user, sessions, accounts, passkeys, paymentProcessorAccounts } = data;

  // Obtenemos la URL de autorización
  const authorizationUrl = await api.user.authorize();

  const breadcrumbItems = [
    { label: "Panel", href: "/dashboard" },
    { label: "Perfil", href: "/dashboard" },
  ];

  return (
    <div className="container mx-auto px-6 pb-8 pt-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="space-y-6">
        {/* User Profile Header */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0] flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <CustomizableAvatar user={data.user} />

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      Nombre
                    </label>
                    <p className="text-[#7A7A7A] mt-1 break-words">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      Correo Electrónico
                    </label>
                    <div className="flex items-center gap-2 mt-1 min-w-0">
                      <p className="text-[#7A7A7A] break-all">{user.email}</p>
                      {user.emailVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 text-xs flex-shrink-0"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      ID de Usuario
                    </label>
                    <p className="text-[#7A7A7A] mt-1 font-mono text-sm break-all">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      Tipo de Cuenta
                    </label>
                    <div className="mt-1">
                      <Badge variant={user.isAnonymous ? "outline" : "default"}>
                        {user.isAnonymous ? "Anónimo" : "Registrado"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      Miembro Desde
                    </label>
                    <p className="text-[#7A7A7A] mt-1">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      Última Actualización
                    </label>
                    <p className="text-[#7A7A7A] mt-1">
                      {new Date(user.updatedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#A0A0A0]">
                      Número de Teléfono
                    </label>
                    <div className="flex items-center gap-2 mt-1 min-w-0">
                      {user.phoneNumber ? (
                        <>
                          <p className="text-[#7A7A7A] break-all">
                            {user.phoneNumber}
                          </p>
                          {user.phoneNumberVerified && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 text-xs flex-shrink-0"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          No proporcionado
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0] flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Cuentas Conectadas ({accounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-[#424242] bg-[#242424] gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded bg-[#1d1d1d] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-[#7A7A7A]">
                          {account.providerId.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#7A7A7A] capitalize">
                          {account.providerId}
                        </p>
                        <p className="text-sm text-muted-foreground break-all">
                          ID de Cuenta: {account.accountId}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-sm text-muted-foreground">
                        Conectado{" "}
                        {new Date(account.createdAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#7A7A7A] text-center py-4">
                No hay cuentas conectadas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Processor Accounts */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0] flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Procesadores de Pago ({paymentProcessorAccounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentProcessorAccounts.length > 0 ? (
              <div className="space-y-3">
                {paymentProcessorAccounts.map((processorAccount) => (
                  <div
                    key={processorAccount.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-[#424242] bg-[#242424] gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded bg-[#1d1d1d] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-[#7A7A7A]">
                          {processorAccount.processorType === "stripe"
                            ? "S"
                            : "MP"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#7A7A7A] capitalize">
                            {processorAccount.processorType}
                          </p>
                          <Badge
                            variant={
                              processorAccount.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              processorAccount.status === "active"
                                ? "bg-green-100 text-green-800 text-xs"
                                : processorAccount.status === "suspended"
                                  ? "bg-red-100 text-red-800 text-xs"
                                  : "bg-gray-100 text-gray-800 text-xs"
                            }
                          >
                            {processorAccount.status === "active"
                              ? "Activo"
                              : processorAccount.status === "suspended"
                                ? "Suspendido"
                                : "Inactivo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground break-all">
                          ID: {processorAccount.processorAccountId}
                        </p>
                        {processorAccount.tokenExpiresAt && (
                          <p className="text-xs text-muted-foreground">
                            Token expira:{" "}
                            {new Date(
                              processorAccount.tokenExpiresAt
                            ).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-sm text-muted-foreground">
                        Conectado{" "}
                        {new Date(
                          processorAccount.createdAt
                        ).toLocaleDateString("es-ES")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Actualizado{" "}
                        {new Date(
                          processorAccount.updatedAt
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-[#7A7A7A] mb-2">
                  No hay procesadores de pago conectados
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Conecta Stripe o MercadoPago para comenzar a recibir pagos
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={authorizationUrl}>
                    <Button className="bg-[#009EE3] hover:bg-[#0088CC] text-white">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Conectar MercadoPago
                    </Button>
                  </Link>
                  <Link href="/dashboard/stripe/connect">
                    <Button variant="outline" className="border-[#6772E5] text-[#6772E5] hover:bg-[#6772E5] hover:text-white">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Conectar Stripe
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phone Number Verification */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0] flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Número de Teléfono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhoneVerificationManager
              phoneNumber={user.phoneNumber}
              phoneNumberVerified={user.phoneNumberVerified ?? false}
            />
          </CardContent>
        </Card>

        {/* Passkeys Management */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0] flex items-center gap-2">
              <Key className="h-5 w-5" />
              Llaves de Acceso ({passkeys.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* <PasskeyManager initialPasskeys={passkeys} /> */}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-medium text-[#A0A0A0] flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Sesiones Activas ({sessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-[#424242] bg-[#242424] gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded bg-[#1d1d1d] flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-[#7A7A7A]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#7A7A7A]">
                          {session.userAgent?.includes("Mobile")
                            ? "Dispositivo Móvil"
                            : "Escritorio"}
                        </p>
                        <p className="text-sm text-muted-foreground break-words">
                          IP: {session.ipAddress || "Desconocido"}
                        </p>
                        {session.userAgent && (
                          <p className="text-xs text-muted-foreground break-all">
                            {session.userAgent}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-sm text-muted-foreground">
                        Creado{" "}
                        {new Date(session.createdAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expira{" "}
                        {new Date(session.expiresAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#7A7A7A] text-center py-4">
                No hay sesiones activas
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
