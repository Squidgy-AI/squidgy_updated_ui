import { Request, Response } from "express";

// Mock GHL account creation - replace with actual GHL API integration
export const createSubaccountAndUser = async (req: Request, res: Response) => {
  try {
    const {
      company_id,
      snapshot_id,
      agency_token,
      user_id,
      subaccount_name,
      prospect_email,
      prospect_first_name,
      prospect_last_name,
      phone,
      website,
      address,
      city,
      state,
      country,
      postal_code,
      timezone
    } = req.body;

    // Validate required fields
    if (!company_id || !snapshot_id || !agency_token || !user_id || !subaccount_name || !prospect_email) {
      return res.status(400).json({
        status: 'error',
        detail: 'Missing required fields: company_id, snapshot_id, agency_token, user_id, subaccount_name, prospect_email'
      });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock GHL account data
    const randomId = Math.random().toString(36).substring(2, 15);
    const locationId = `loc_${randomId}`;
    const businessUserId = `user_${randomId}_business`;
    const somaUserId = `user_${randomId}_soma`;

    const mockResponse = {
      status: 'success',
      subaccount: {
        location_id: locationId,
        subaccount_name: subaccount_name,
        created_at: new Date().toISOString()
      },
      business_user: {
        user_id: businessUserId,
        details: {
          name: `${prospect_first_name} ${prospect_last_name}`,
          email: prospect_email,
          phone: phone,
          role: 'Business Owner'
        }
      },
      soma_user: {
        user_id: somaUserId,
        details: {
          name: 'SOMA Assistant',
          email: `soma+${randomId}@squidgy.ai`,
          phone: phone,
          role: 'Sales Assistant'
        }
      },
      integration_ready: true,
      facebook_automation_credentials: {
        email: 'info+zt1rcl49@squidgy.net',
        password: 'Dummy@123'
      }
    };

    res.json(mockResponse);
  } catch (error) {
    console.error("GHL account creation error:", error);
    res.status(500).json({
      status: 'error',
      detail: "Failed to create GHL account",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
