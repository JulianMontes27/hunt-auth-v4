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
    <div className="container mx-auto px-6 md:px-0 pb-8 ">
      <main className="flex-1 p-0 md:p-6 pt-0">
        <Tabs defaultValue="overview">
          <div className="flex items-center justify-between">
            <TabsList className="">
              <TabsTrigger value="overview" className="text-[#7A7A7A]">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-[#7A7A7A]">
                Analíticas
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-[#7A7A7A]">
                Reportes
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>
          </div>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Ingresos Totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#7A7A7A]">
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
                  <div className="text-2xl font-bold text-[#7A7A7A]">+2350</div>
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
                  <div className="text-2xl font-bold text-[#7A7A7A]">
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
                  <div className="text-2xl font-bold text-[#7A7A7A]">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 desde la última hora
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                  <p>
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
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer"
                  >
                    Ver Todos los Pedidos
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
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
                      className="bg-[#242424] border border-[#424242] text-[#7A7A7A]"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Últimos 30 días
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border border-dashed border-[#424242] bg-[#242424] flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
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
                        color: "text-blue-500",
                        bg: "bg-blue-100",
                        title: "Nuevo miembro se unió al equipo",
                        time: "hace 2 horas",
                      },
                      {
                        icon: CreditCard,
                        color: "text-green-500",
                        bg: "bg-green-100",
                        title: "Pago de suscripción exitoso",
                        time: "hace 5 horas",
                      },
                      {
                        icon: ShoppingCart,
                        color: "text-yellow-500",
                        bg: "bg-yellow-100",
                        title: "Nuevo pedido recibido",
                        time: "hace 1 día",
                      },
                      {
                        icon: Package,
                        color: "text-red-500",
                        bg: "bg-red-100",
                        title: "Producto agotado",
                        time: "hace 2 días",
                      },
                    ].map((notification, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${notification.bg}`}
                        >
                          <notification.icon
                            className={`h-4 w-4 ${notification.color}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-[#7A7A7A]">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Users, label: "Agregar Usuario" },
                      { icon: Package, label: "Nuevo Producto" },
                      { icon: CreditCard, label: "Facturación" },
                      { icon: Settings, label: "Configuración" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-20 flex-col bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer"
                      >
                        <action.icon className="mb-2 h-5 w-5" />
                        {action.label}
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
                  <div className="space-y-4">
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
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={`h-5 w-5 rounded-full border ${task.completed ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                        >
                          {task.completed && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-[#7A7A7A]"}`}
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
                  <div className="space-y-4">
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
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
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
          <TabsContent value="analytics" className="space-y-4 pt-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Analíticas</CardTitle>
                <CardDescription>
                  Ve tus datos analíticos e información detallada.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Los gráficos de analíticas aparecerán aquí
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4 pt-4">
            <Card className="">
              <CardHeader>
                <CardTitle>Reportes</CardTitle>
                <CardDescription>Ve y descarga tus reportes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Los reportes aparecerán aquí
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
