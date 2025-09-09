import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous, magicLink, openAPI } from "better-auth/plugins";
import { sendMagicLinkEmail } from "./email";
import { emailOTP, phoneNumber } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { Resend } from "resend";
import twilio from "twilio";

// Initialize Resend lazily
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Initialize Twilio lazily
const getTwilioClient = () =>
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  advanced: {
    cookiePrefix: "hunt-tickets",
    defaultCookieAttributes: {
      // sameSite: "none", // Allow cross-site requests
      // secure: true, // HTTPS required for SameSite=None
      // partitioned: true, // Future browser standard

      // For development, always run this server locally, do not access from a deployment URL.
      sameSite: "lax", // For localhost development
      secure: false, // Since you're using HTTP in development
      partitioned: false,
    },
    // crossSubDomainCookies: {
    //   enabled: true,
    //   domain: "hunt-tickets.com", // your domain
    // },
  },

  // The trustedOrigins config in Better Auth handles security validation but doesn't set the necessary HTTP headers (Access-Control-Allow-Origin, etc.) that browsers require for cross-origin JavaScript requests. This is why authentication works (browser redirects don't need CORS) but the client app can't make API calls to check session status or refresh tokens.

  // Better Auth ensures CSRF protection by validating the Origin header in requests. This check confirms that requests originate from the application or a trusted source. If a request comes from an untrusted origin, it is blocked to prevent potential CSRF attacks. By default, the origin matching the base URL is trusted, but you can set a list of trusted origins in the trustedOrigins configuration option.
  // Trusted origins prevent CSRF attacks and block open redirects. You can set a list of trusted origins in the trustedOrigins configuration option. Requests from origins not on this list are automatically blocked.
  trustedOrigins: [
    // Allow requests from the frontend development server
    // Add development origins for cross-machine testing
    // Add your machine's local IP if needed
    // "http://192.168.1.100:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://hunt-auth-v4.onrender.com", // Add your Render URL

    "https://*.hunt-tickets.com", // Trust only HTTPS subdomains of example.com
    // "http://*.dev.example.com", // Trust all HTTP subdomains of dev.example.com
  ],

  // Configure for subdomain sharing
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  plugins: [
    nextCookies(),
    openAPI(),
    anonymous(),

    magicLink({
      sendMagicLink: async ({ email, url }) => {
        try {
          await sendMagicLinkEmail({ email, url });
        } catch (error) {
          console.error("Failed to send magic link email:", error);
          throw new Error("Failed to send magic link email");
        }
      },
    }),

    passkey({
      rpID:
        process.env.NODE_ENV === "production" && process.env.BETTER_AUTH_URL
          ? new URL(process.env.BETTER_AUTH_URL).hostname
          : "localhost",
      rpName: "Hunt Tickets",
      origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      authenticatorSelection: {
        authenticatorAttachment: undefined, // Allow both platform and cross-platform
        residentKey: "preferred",
        userVerification: "preferred",
      },
    }),

    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        let subject: string;
        let html: string;

        if (type === "sign-in") {
          subject = `Código de Acceso - ${otp}`;

          // Check if we need to also send SMS with the same code
          let phoneNumber = null;

          console.log(
            "🔍 Debug - Full request object:",
            JSON.stringify(request, null, 2)
          );

          try {
            // Try multiple ways to extract phone number
            if (request && request.body) {
              console.log("🔍 Debug - Request body:", request.body);
              const body =
                typeof request.body === "string"
                  ? JSON.parse(request.body)
                  : request.body;
              console.log("🔍 Debug - Parsed body:", body);
              phoneNumber = body.phoneNumber;
            }

            // Also check headers, URL params, etc.
            if (!phoneNumber && request) {
              console.log("🔍 Debug - Request keys:", Object.keys(request));
              if (request.headers && request.headers.get) {
                console.log("🔍 Debug - Headers:", request.headers);
                // Try to get the phone number from headers using the get method
                phoneNumber =
                  request.headers.get("x-phone-number") ||
                  request.headers.get("X-Phone-Number");
                console.log(
                  "🔍 Debug - Extracted phoneNumber from headers:",
                  phoneNumber
                );
              }
              if (!phoneNumber && request.url) {
                const url = new URL(request.url, "http://localhost:3000");
                phoneNumber = url.searchParams.get("phoneNumber");
                console.log("🔍 Debug - Phone from URL:", phoneNumber);
              }
            }
          } catch (e) {
            console.log("🔍 Debug - Error extracting phone:", e);
            console.log(
              "Could not extract phone number from request, skipping SMS"
            );
          }

          console.log("🔍 Debug - Final phoneNumber:", phoneNumber);

          // Send SMS with the same OTP code if we have the phone number
          if (phoneNumber) {
            try {
              // Check if phone number is already verified by another user
              const { and, eq } = await import("drizzle-orm");
              const existingVerifiedUser = await db
                .select()
                .from(schema.user)
                .where(
                  and(
                    eq(schema.user.phonenumber, phoneNumber),
                    eq(schema.user.phonenumberverified, true)
                  )
                )
                .limit(1);

              if (existingVerifiedUser.length > 0) {
                console.log(
                  `🚫 Phone number ${phoneNumber} is already verified by another user, skipping SMS`
                );
                // Don't send SMS to verified phone numbers owned by other users
                return;
              }

              console.log(
                `📱 Also sending email OTP code to SMS ${phoneNumber}: ${otp}`
              );

              const message = await getTwilioClient().messages.create({
                body: `Tu código de verificación Hunt Tickets: ${otp}. Válido por 5 minutos. No compartas este código.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
              });

              console.log(
                `✅ SMS also sent successfully. Message SID: ${message.sid}`
              );
            } catch (smsError) {
              console.error(
                `⚠️ Failed to send SMS to ${phoneNumber}:`,
                smsError
              );
              // Don't fail the entire process if SMS fails, email is the primary method
            }
          }

          html = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>🔐 Tu código de verificación - Hunt Tickets</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
    * {
      font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #f0f0f0;
      color: #2D2D2D;
    }
    table, td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      max-width: 100%;
    }
    p {
      margin: 0 0 12px 0;
      line-height: 1.6;
      font-weight: 400;
    }
    .otp-container {
      background: linear-gradient(135deg, #000000 0%, #2a2a2a 100%);
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .otp-code {
      background-color: #ffffff;
      color: #000000;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 10px;
      padding: 20px 30px;
      border-radius: 8px;
      display: inline-block;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
      margin: 15px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .timer-text {
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
    }
    .social-icon {
      display: inline-block;
      margin: 0 8px;
    }
    @media only screen and (max-width: 640px) {
      .wrapper-table {
        width: 100% !important;
      }
      .main-container {
        width: 100% !important;
        margin: 0 !important;
      }
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      font-family: Arial, sans-serif !important;
    }
    .otp-code {
      font-family: Courier New, monospace !important;
    }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif; color: #2D2D2D;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Tu código de verificación es: ${otp}. No lo compartas con nadie. Válido por 10 minutos.
  </div>
  
  <!-- Wrapper table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper-table" style="background-color: #f0f0f0; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <!-- Email Container -->
        <!--[if mso]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px;">
        <tr>
        <td>
        <![endif]-->
        <table class="main-container" align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header with gradient -->
          <tr>
            <td style="padding: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px 20px;">
                    <img src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png" alt="Hunt Tickets" width="140" height="46" style="display: block; border: 0; max-width: 140px; height: auto;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="mobile-padding" style="padding: 40px 45px 20px 45px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <!-- Welcome message -->
                    <p style="margin: 0 0 30px 0; font-size: 18px; line-height: 1.6; color: #333333; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif; text-align: center;">
                      Hola, aquí está tu código de verificación para crear tu cuenta Hunt Tickets
                    </p>
                    ${
                      phoneNumber
                        ? `<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #666666; text-align: center;">
                      📧 Enviado por email • 📱 También enviado por SMS a ${phoneNumber}
                    </p>`
                        : ""
                    }
                    
                    <!-- OTP Section Minimalista -->
                    <div style="margin: 20px 0 30px 0;">
                      <div style="background-color: #f8f8f8; border: 1px solid #cccccc; border-radius: 12px; padding: 30px 20px; text-align: center;">
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #666666; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Código de verificación</p>
                        <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #000000; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif; margin: 0 0 15px 0;">${otp}</div>
                        <p style="margin: 0; font-size: 14px; color: #666666;">Válido por 10 minutos</p>
                      </div>
                    </div>
                    
                    <!-- Instructions -->
                    <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: left;">
                      <p style="margin: 0 0 8px 0; font-size: 15px; color: #333333; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;">
                        <strong>📋 Instrucciones:</strong>
                      </p>
                      <ul style="margin: 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                        <li>Ingresa este código en la pantalla de verificación</li>
                        <li>No compartas este código con nadie</li>
                        <li>Si no solicitaste este código, ignora este correo</li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Security Notice -->
          <tr>
            <td class="mobile-padding" style="padding: 0 45px 30px 45px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff3cd; border-radius: 8px;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="30" valign="top">
                          <span style="font-size: 20px;">🔒</span>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #856404; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;">
                            <strong>Recordatorio de seguridad:</strong> Hunt Tickets nunca te pedirá tu código de verificación por teléfono, WhatsApp o correo. Mantén tu código privado.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Legal Footer with all info -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f3f3f3; font-size: 11px; color: #777777; text-align: center; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;">
              <p style="margin: 0 0 10px 0; font-size: 13px; color: #555555; font-weight: 500; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;">
                © 2025 Hunt Tickets S.A.S. NIT 901881747-0
              </p>
              <p style="margin: 0 0 15px 0; font-size: 12px; color: #666666; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;">
                ¿Necesitas ayuda? Escríbenos a <a href="mailto:info@hunt-tickets.com" style="color: #555555; text-decoration: underline;">info@hunt-tickets.com</a>
              </p>
              <p style="margin: 0; line-height: 1.6; font-weight: 400; text-align: justify; font-family: 'Source Sans 3', Helvetica, Arial, sans-serif;">
                Por favor, no respondas ya que esta dirección no acepta correos electrónicos y no recibirás respuesta. Este correo electrónico de servicio contiene información esencial relacionada con tu cuenta de Hunt Tickets, tus compras reciente, reservas o suscripciones a uno de nuestros servicios. En Hunt Tickets respetamos y protegemos tu privacidad de acuerdo con nuestra <a href="https://www.hunt-tickets.com/resources/privacy" style="color: #555; text-decoration: underline;">Política de Privacidad</a> y <a href="https://www.hunt-tickets.com/resources/terms-and-conditions" style="color: #555; text-decoration: underline;">Términos & Condiciones</a>.
                Este correo ha sido enviado por Hunt Tickets S.A.S (NIT 901881747-0), con sede en la ciudad de Bogotá D.C., Colombia. La información contenida es confidencial y de uso exclusivo del destinatario.
              </p>
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
`;
        } else if (type === "email-verification") {
          subject = "Verify your email address";
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Verify your email address</h2>
              <p>Please use this verification code to complete your email verification:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
              </div>
              <p>This code will expire in 5 minutes.</p>
            </div>
          `;
        } else {
          subject = "Reset your password";
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset your password</h2>
              <p>Use this verification code to reset your password:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
              </div>
              <p>This code will expire in 5 minutes.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          `;
        }

        try {
          await getResend().emails.send({
            from:
              process.env.FROM_EMAIL ||
              "Hunt Auth <team@support.hunttickets.com>",
            to: email,
            subject,
            html,
          });
          console.log(`${type} OTP sent to ${email}`);
        } catch (error) {
          console.error(`Failed to send ${type} OTP to ${email}:`, error);
          // For development, also log to console as fallback
          console.log(`Fallback - ${type} OTP for ${email}: ${otp}`);
        }
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      // allowedAttempts: 3
    }),

    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        try {
          // Log for development
          console.log(`📱 Sending OTP to ${phoneNumber}: ${code}`);

          // Send SMS via Twilio
          const message = await getTwilioClient().messages.create({
            body: `Tu código de verificación Hunt Tickets: ${code}. Válido por 5 minutos. No compartas este código.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
          });

          console.log(`✅ SMS sent successfully. Message SID: ${message.sid}`);

          // Note: For unified email+SMS OTP during signup, we use a custom system
          // This function handles regular phone number verification
        } catch (error) {
          console.error(`❌ Failed to send SMS to ${phoneNumber}:`, error);

          // For development, still log the code as fallback
          console.log(`Fallback - OTP for ${phoneNumber}: ${code}`);

          // Re-throw error so Better Auth can handle it
          throw new Error(
            `SMS delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@my-site.com`;
        },
        //optionally, you can also pass `getTempName` function to generate a temporary name for the user
        getTempName: (phoneNumber) => {
          return phoneNumber; //by default, it will use the phone number as the name
        },
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
  ],
});
