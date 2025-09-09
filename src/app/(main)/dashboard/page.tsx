import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PasskeyManager } from "@/components/dashboard/PasskeyManager";
import { PhoneVerificationManager } from "@/components/dashboard/PhoneVerificationManager";
import { db } from "@/db/drizzle";
import {
  user as userSchema,
  session as sessionSchema,
  account as accountSchema,
  passkey as passkeySchema,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { User, Mail, Shield, Key, Clock, MapPin, Phone } from "lucide-react";
import CustomizableAvatar from "@/components/dashboard/CustomizableAvatar";

async function getUserData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const userData = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, session.user.id))
    .limit(1);

  const userSessions = await db
    .select()
    .from(sessionSchema)
    .where(eq(sessionSchema.userId, session.user.id))
    .orderBy(sessionSchema.createdAt);

  const userAccounts = await db
    .select()
    .from(accountSchema)
    .where(eq(accountSchema.userId, session.user.id));

  const userPasskeys = await db
    .select()
    .from(passkeySchema)
    .where(eq(passkeySchema.userId, session.user.id))
    .orderBy(passkeySchema.createdAt);

  return {
    user: userData[0] || null,
    sessions: userSessions,
    accounts: userAccounts,
    passkeys: userPasskeys,
  };
}

export default async function ProfilePage() {
  const data = await getUserData();

  if (!data?.user) {
    return (
      <div className="container mx-auto px-6 pb-8 pt-8">
        <Card className="shadow-none">
          <CardContent className="p-8 text-center">
            <p className="text-[#7A7A7A]">Inicia sesion para poder acceder.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, sessions, accounts, passkeys } = data;
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
            <PasskeyManager initialPasskeys={passkeys} />
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
