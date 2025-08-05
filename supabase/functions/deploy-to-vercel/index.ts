import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { siteName, slug, clientId, githubRepoUrl } = await req.json()

    // Vercel credentials from environment
    const vercelToken = Deno.env.get('VERCEL_TOKEN')!
    const vercelTeamId = Deno.env.get('VERCEL_TEAM_ID')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Create Vercel project
    const createProjectResponse = await fetch('https://api.vercel.com/v10/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${slug}-studyabroad`,
        gitRepository: {
          type: 'github',
          repo: githubRepoUrl.replace('https://github.com/', ''),
        },
        buildCommand: 'npm run build',
        devCommand: 'npm run dev',
        installCommand: 'npm install',
        outputDirectory: 'dist',
        publicSource: false,
        rootDirectory: null,
        serverlessFunctionRegion: 'iad1',
        environmentVariables: [
          {
            key: 'SUPABASE_URL',
            value: supabaseUrl,
            type: 'encrypted',
            target: ['production', 'preview', 'development'],
          },
          {
            key: 'SUPABASE_PUBLISHABLE_KEY',
            value: supabaseKey,
            type: 'encrypted',
            target: ['production', 'preview', 'development'],
          },
          {
            key: 'CLIENT_ID',
            value: clientId,
            type: 'encrypted',
            target: ['production', 'preview', 'development'],
          },
        ],
        ...(vercelTeamId && { teamId: vercelTeamId }),
      }),
    })

    if (!createProjectResponse.ok) {
      const errorText = await createProjectResponse.text()
      throw new Error(`Failed to create Vercel project: ${createProjectResponse.statusText} - ${errorText}`)
    }

    const projectData = await createProjectResponse.json()

    // Trigger initial deployment
    const deployResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${slug}-studyabroad`,
        gitSource: {
          type: 'github',
          repo: githubRepoUrl.replace('https://github.com/', ''),
          ref: 'main',
        },
        projectSettings: {
          buildCommand: 'npm run build',
          devCommand: 'npm run dev',
          installCommand: 'npm install',
          outputDirectory: 'dist',
        },
        ...(vercelTeamId && { teamId: vercelTeamId }),
      }),
    })

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text()
      console.error(`Deployment failed: ${deployResponse.statusText} - ${errorText}`)
    }

    const deploymentData = await deployResponse.json()

    return new Response(
      JSON.stringify({
        success: true,
        projectId: projectData.id,
        projectUrl: `https://${projectData.name}.vercel.app`,
        deploymentUrl: deploymentData.url ? `https://${deploymentData.url}` : null,
        message: 'Vercel project created and deployed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})