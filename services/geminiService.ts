import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProcessType, UserRole } from "../types";

//const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ✅ 安全：从环境变量读取
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || ""
});

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn("⚠️ Gemini API 密钥未配置，将使用后备数据或请求会失败");
}

// Define the response schema for the checklist
const checklistSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: "A specific actionable task."
          },
          category: {
            type: Type.STRING,
            description: "Category of the task (Hardware, Legal, Facilities, Access)."
          },
          department: {
            type: Type.STRING,
            description: "The department responsible: 'HR', 'IT', or 'ADMIN'.",
            enum: ["HR", "IT", "ADMIN"]
          },
          timeline: {
            type: Type.STRING,
            description: "When this should happen relative to start date (e.g. 'Day -7', 'Day 0', 'Day 1')."
          }
        },
        required: ["description", "category", "department", "timeline"]
      }
    }
  }
};

export const generateITChecklist = async (
  role: string,
  department: string,
  type: ProcessType,
  notes: string = ""
): Promise<{ description: string; category: string; department: UserRole; timeline: string }[]> => {
  try {
    const prompt = `
      Act as an Operations Director. Generate a comprehensive cross-departmental checklist for the following scenario:
      
      Process: ${type}
      Role: ${role}
      Department: ${department}
      Additional Notes: ${notes}

      You must coordinate between HR, IT, and ADMIN (Facilities).
      
      For ONBOARDING, sequence the events logicially:
      1. HR: Contract signing, document collection (Day -14).
      2. IT: Hardware procurement, account creation (Day -7).
      3. ADMIN: Desk setup, access badge, welcome kit (Day -1).
      
      For OFFBOARDING:
      1. HR: Exit interview, legal paperwork.
      2. IT: Backup data, revoke access, collect electronics.
      3. ADMIN: Collect badge, desk inspection.

      Be specific to the role (e.g., Designers need Macs/Figma; Sales needs Mobile/CRM).
      Assign each task strictly to 'HR', 'IT', or 'ADMIN'.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: checklistSchema,
        systemInstruction: "You are an expert enterprise workflow automation assistant."
      }
    });

    const text = response.text;
    if (!text) return getFallbackList(type);

    const data = JSON.parse(text);
    return data.tasks || getFallbackList(type);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackList(type);
  }
};

// Fallback in case API fails
const getFallbackList = (type: ProcessType) => {
  if (type === ProcessType.ONBOARDING) {
    return [
      { description: "Send Offer Letter & Contract", category: "Legal", department: UserRole.HR, timeline: "Day -14" },
      { description: "Collect Signed Documents", category: "Legal", department: UserRole.HR, timeline: "Day -10" },
      { description: "Order Laptop & Peripherals", category: "Hardware", department: UserRole.IT, timeline: "Day -7" },
      { description: "Create Email & Slack Account", category: "Accounts", department: UserRole.IT, timeline: "Day -3" },
      { description: "Assign Desk Seating", category: "Facilities", department: UserRole.ADMIN, timeline: "Day -2" },
      { description: "Prepare Access Badge", category: "Security", department: UserRole.ADMIN, timeline: "Day -1" }
    ];
  } else {
    return [
      { description: "Conduct Exit Interview", category: "HR", department: UserRole.HR, timeline: "Day -7" },
      { description: "Revoke System Access", category: "Security", department: UserRole.IT, timeline: "Day 0" },
      { description: "Collect Laptop", category: "Hardware", department: UserRole.IT, timeline: "Day 0" },
      { description: "Collect Building Badge", category: "Facilities", department: UserRole.ADMIN, timeline: "Day 0" }
    ];
  }
};