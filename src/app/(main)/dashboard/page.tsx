import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { PasskeyCard } from "@/components/dashboard/passkey/PasskeyCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardPage() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    console.log("session :", session);
    if (!session) {
      redirect("/sign-in");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT")
      console.error("Auth error:", error);
    redirect("/sign-in");
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <main className="flex-1 p-0 pt-4">
        <Tabs defaultValue="overview">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger
                value="overview"
                className="text-[#7A7A7A] flex-1 sm:flex-none"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-[#7A7A7A] flex-1 sm:flex-none"
              >
                Analíticas
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="text-[#7A7A7A] flex-1 sm:flex-none"
              >
                Reportes
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Descargar</span>
                <span className="xs:hidden">Descargar</span>
              </Button>
            </div>
          </div>
          <TabsContent value="overview" className="space-y-4 pt-0">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Ingresos Totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-[#7A7A7A] break-words">
                    $45,231.89
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Suscripciones
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-[#7A7A7A]">
                    +2350
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Ventas
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-[#7A7A7A]">
                    +12,234
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +19% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Activos Ahora
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-[#7A7A7A]">
                    +573
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +201 desde la última hora
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="lg:col-span-4 shadow-none">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Ventas Recientes
                  </CardTitle>
                  <CardDescription>
                    Realizaste 265 ventas este mes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[#7A7A7A]">
                  <p className="text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3 shadow-none">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Pedidos Recientes
                  </CardTitle>
                  <CardDescription>
                    Recibiste 30 pedidos este mes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[#7A7A7A]">
                  <p className="text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer text-sm"
                  >
                    <span className="hidden sm:inline">
                      Ver Todos los Pedidos
                    </span>
                    <span className="sm:hidden">Ver Pedidos</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="lg:col-span-4 shadow-none">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle className="font-medium text-[#A0A0A0]">
                      Resumen de Rendimiento
                    </CardTitle>
                    <CardDescription>
                      Ingresos mensuales y crecimiento de usuarios
                    </CardDescription>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#242424] border border-[#424242] text-[#7A7A7A] w-full sm:w-auto"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Últimos 30 días</span>
                      <span className="sm:hidden">30d</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] sm:h-[300px] w-full rounded-md border border-dashed border-[#424242] bg-[#242424] flex items-center justify-center">
                    <div className="flex flex-col items-center text-center px-4">
                      <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Visualización del gráfico de rendimiento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3 shadow-none">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Notificaciones Recientes
                  </CardTitle>
                  <CardDescription>
                    Mantente actualizado con las últimas alertas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Users,
                        color: "text-blue-400",
                        bg: "bg-blue-500/10",
                        title: "Nuevo miembro se unió al equipo",
                        time: "hace 2 horas",
                      },
                      {
                        icon: CreditCard,
                        color: "text-green-400",
                        bg: "bg-green-500/10",
                        title: "Pago de suscripción exitoso",
                        time: "hace 5 horas",
                      },
                      {
                        icon: ShoppingCart,
                        color: "text-yellow-400",
                        bg: "bg-yellow-500/10",
                        title: "Nuevo pedido recibido",
                        time: "hace 1 día",
                      },
                      {
                        icon: Package,
                        color: "text-red-400",
                        bg: "bg-red-500/10",
                        title: "Producto agotado",
                        time: "hace 2 días",
                      },
                    ].map((notification, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full ${notification.bg} flex-shrink-0`}
                        >
                          <notification.icon
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${notification.color}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium leading-none text-[#7A7A7A] break-words">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Passkey Security Section */}
            <PasskeyCard />

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Acciones Rápidas
                  </CardTitle>
                  <CardDescription>
                    Herramientas y atajos de uso frecuente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Users, label: "Agregar Usuario" },
                      { icon: Package, label: "Nuevo Producto" },
                      { icon: CreditCard, label: "Facturación" },
                      { icon: Settings, label: "Configuración" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-16 sm:h-20 flex-col bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer text-xs sm:text-sm"
                      >
                        <action.icon className="mb-1 sm:mb-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-center leading-tight">
                          {action.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Tareas Próximas
                  </CardTitle>
                  <CardDescription>
                    Tus tareas programadas para hoy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        title: "Reunión de equipo",
                        time: "10:00 AM",
                        completed: false,
                      },
                      {
                        title: "Revisión de proyecto",
                        time: "1:30 PM",
                        completed: false,
                      },
                      {
                        title: "Llamada con cliente",
                        time: "3:00 PM",
                        completed: false,
                      },
                      {
                        title: "Actualizar documentación",
                        time: "4:30 PM",
                        completed: true,
                      },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border flex-shrink-0 ${task.completed ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                        >
                          {task.completed && (
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-medium break-words ${task.completed ? "line-through text-muted-foreground" : "text-[#7A7A7A]"}`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Actividad del Equipo
                  </CardTitle>
                  <CardDescription>
                    Acciones recientes de tu equipo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        user: "Alex",
                        action: "creó un nuevo proyecto",
                        time: "Ahora mismo",
                      },
                      {
                        user: "Sarah",
                        action: "completó 3 tareas",
                        time: "hace 1 hora",
                      },
                      {
                        user: "Michael",
                        action: "subió nuevos archivos",
                        time: "hace 3 horas",
                      },
                      {
                        user: "Jessica",
                        action: "invitó a 2 nuevos miembros",
                        time: "Ayer",
                      },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <p className="text-xs sm:text-sm break-words">
                            <span className="font-medium text-[#7A7A7A]">
                              {activity.user}
                            </span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4 pt-0">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Analíticas</CardTitle>
                <CardDescription>
                  Ve tus datos analíticos e información detallada.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] sm:h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  <p className="text-center px-4 text-sm sm:text-base">
                    Los gráficos de analíticas aparecerán aquí
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4 pt-0">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Reportes</CardTitle>
                <CardDescription>Ve y descarga tus reportes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] sm:h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  <p className="text-center px-4 text-sm sm:text-base">
                    Los reportes aparecerán aquí
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
