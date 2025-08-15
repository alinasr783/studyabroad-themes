import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const VERCEL_TOKEN = "AV7yd6OWTcDqe3j71x1GZeEc";
const VERCEL_TEAM_ID = "team_JkG8fKhKAmyVbL65s8aHdvZt";
const VERCEL_PROJECT_TEMPLATE = "alinasr783/studyabroad-themes";

serve(async (req) => {
  try {
    const { name, clientId } = await req.json();

    if (!name || !clientId) {
      return new Response(JSON.stringify({ error: "Missing name or clientId" }), { status: 400 });
    }

    // 1️⃣ إنشاء مشروع جديد في Vercel
    const createProjectRes = await fetch(`https://api.vercel.com/v9/projects?teamId=${VERCEL_TEAM_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        framework: "vite",
        gitRepository: {
          type: "github",
          repo: VERCEL_PROJECT_TEMPLATE,
        },
        buildCommand: "npm run build",
        outputDirectory: "dist",
      }),
    });

    const projectData = await createProjectRes.json();
    if (!createProjectRes.ok) {
      throw new Error(projectData.error?.message || "Failed to create Vercel project");
    }

    const projectId = projectData.id;

    // 2️⃣ إضافة دومين مخصص
    const domainName = `${name.replace(/\s+/g, "-").toLowerCase()}.example.com`;
    const addDomainRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains?teamId=${VERCEL_TEAM_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domainName }),
    });

    const domainData = await addDomainRes.json();
    if (!addDomainRes.ok) {
      throw new Error(domainData.error?.message || "Failed to add domain to project");
    }

    return new Response(
      JSON.stringify({
        success: true,
        projectId,
        projectUrl: `https://${projectData.name}.vercel.app`,
        customDomain: domainName,
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
