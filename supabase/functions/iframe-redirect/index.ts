
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface CreateLowProfileRequest {
  terminalNumber: number;
  apiName: string;
  amount: number;
  successUrl: string;
  failedUrl: string;
  webhookUrl: string;
  productName?: string;
  language?: string;
  returnValue?: string;
  operation?: string; // Add operation parameter
}

serve(async (req) => {
  // Handle CORS if needed
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData: CreateLowProfileRequest = await req.json();
    
    // Validate required fields
    if (!requestData.terminalNumber || !requestData.apiName || !requestData.amount || 
        !requestData.successUrl || !requestData.failedUrl || !requestData.webhookUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "terminalNumber, apiName, amount, successUrl, failedUrl, and webhookUrl are required"
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Convert numeric operation to string enum expected by CardCom
    let operation = requestData.operation;
    if (typeof operation === 'number') {
      switch (operation) {
        case 1:
          operation = 'ChargeOnly';
          break;
        case 2:
          operation = 'ChargeAndCreateToken';
          break;
        case 3:
          operation = 'CreateTokenOnly';
          break;
      }
    } else if (operation === '1') {
      operation = 'ChargeOnly';
    } else if (operation === '2') {
      operation = 'ChargeAndCreateToken';
    } else if (operation === '3') {
      operation = 'CreateTokenOnly';
    }

    // Build request body for Cardcom API
    const cardcomRequestBody = {
      TerminalNumber: requestData.terminalNumber,
      ApiName: requestData.apiName,
      // Include the operation (e.g. ChargeAndCreateToken) for recurring payments
      Operation: operation || "ChargeAndCreateToken",
      Amount: requestData.amount,
      SuccessRedirectUrl: requestData.successUrl,
      FailedRedirectUrl: requestData.failedUrl,
      WebHookUrl: requestData.webhookUrl,
      ProductName: requestData.productName || "AlgoTouch Subscription",
      Language: requestData.language || "he",
      ReturnValue: requestData.returnValue || "",
      UIDefinition: {
        IsHideCardOwnerName: false,
        IsHideCardOwnerPhone: false,
        IsCardOwnerPhoneRequired: true,
        IsHideCardOwnerEmail: false,
        IsCardOwnerEmailRequired: true
      }
    };

    console.log("Sending request to Cardcom:", JSON.stringify(cardcomRequestBody));

    // Call Cardcom API to create low profile page (updated to v11)
    const response = await fetch("https://secure.cardcom.solutions/api/v11/LowProfile/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cardcomRequestBody)
    });

    // Parse the response
    const data = await response.json();
    
    console.log("Received response from Cardcom:", JSON.stringify(data));
    
    // Return the response
    return new Response(
      JSON.stringify(data),
      {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    // Handle errors
    console.error("Error in iframe-redirect function:", error);
    
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
