import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompletionEmailRequest {
  email: string;
  jobType: string;
  result: {
    totalProcessed: number;
    ptFound: number;
    inserted: number;
    message: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, jobType, result }: CompletionEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "PT Marketplace <onboarding@resend.dev>",
      to: [email],
      subject: `${jobType} Completed Successfully! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">Processing Complete! 🎉</h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your <strong>${jobType}</strong> has finished processing successfully.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #1e293b; margin-top: 0; margin-bottom: 16px;">📊 Processing Results</h2>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">Total Records Processed:</span>
                <span style="font-weight: 700; color: #059669;">${result.totalProcessed.toLocaleString()}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">PT Providers Found:</span>
                <span style="font-weight: 700; color: #2563eb;">${result.ptFound.toLocaleString()}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="font-weight: 600; color: #64748b;">Successfully Imported:</span>
                <span style="font-weight: 700; color: #7c3aed;">${result.inserted.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style="background-color: #fef7cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>💡 Next Steps:</strong> Your new providers are ready for geocoding! 
              Visit your dashboard to run the geocoding process and enable radius-based searches.
            </p>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin: 0;">
              This is an automated notification from your PT Marketplace processing system.
              <br>
              If you have any questions, please contact support.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Completion email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending completion email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);