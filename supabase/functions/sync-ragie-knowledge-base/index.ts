import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get query and user_uuid from request body
    const { query, user_uuid } = await req.json()
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!user_uuid) {
      return new Response(
        JSON.stringify({ error: 'user_uuid is required in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Querying Ragie for user: ${user_uuid} with query: ${query}`)

    // Query Ragie with user-specific filter
    const ragieResponse = await fetch('https://api.ragie.ai/retrievals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RAGIE_API_KEY')}`
      },
      body: JSON.stringify({
        query,
        rerank: true,
        filter: {
          scope: user_uuid
        }
      })
    })

    if (!ragieResponse.ok) {
      const ragieError = await ragieResponse.text()
      console.error('Ragie query failed:', ragieError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to query documents', 
          details: ragieError,
          answer: 'I apologize, but I cannot access your documents at the moment. Please try again later.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const ragieData = await ragieResponse.json()
    console.log(`Retrieved ${ragieData.scored_chunks?.length || 0} chunks for user ${user_uuid}`)

    // Generate answer using Ragie - correct endpoint
    const generateResponse = await fetch('https://api.ragie.ai/tutorial/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RAGIE_API_KEY')}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        rerank: true,
        filter: {
          scope: user_uuid
        }
      })
    })

    let answer = 'I found some relevant information in your documents, but I cannot generate a specific answer at the moment.'
    
    if (generateResponse.ok) {
      const generateData = await generateResponse.json()
      // Ragie returns the answer in the 'generation' field
      answer = generateData.generation || generateData.answer || generateData.response || answer
      console.log('Generated answer successfully from Ragie')
    } else {
      const generateError = await generateResponse.text()
      console.error('Ragie generate failed:', generateError)
      
      // If generate fails, create an answer from the retrievals
      if (ragieData.scored_chunks && ragieData.scored_chunks.length > 0) {
        const topChunks = ragieData.scored_chunks.slice(0, 3)
        const relevantInfo = topChunks.map(chunk => chunk.text).join(' ')
        
        // Create a more intelligent answer based on the query and retrieved content
        if (query.toLowerCase().includes('python') && query.toLowerCase().includes('intern')) {
          answer = `Based on your resume, here are your strong points for a Python intern position: ${relevantInfo.substring(0, 400)}. These skills and experiences make you a strong candidate for Python development roles.`
        } else if (query.toLowerCase().includes('django')) {
          answer = `Regarding your Django experience: ${relevantInfo.substring(0, 400)}.`
        } else if (query.toLowerCase().includes('experience')) {
          answer = `Here's your work experience from your resume: ${relevantInfo.substring(0, 400)}.`
        } else if (query.toLowerCase().includes('skills')) {
          answer = `Your skills based on your resume: ${relevantInfo.substring(0, 400)}.`
        } else {
          answer = `Based on your documents: ${relevantInfo.substring(0, 400)}.`
        }
        
        console.log('Created fallback answer from retrievals')
      }
    }

    // Format response for ElevenLabs ConvAI
    const response = {
      success: true,
      answer: answer,
      query: query,
      user_uuid: user_uuid,
      retrievals_count: ragieData.scored_chunks?.length || 0,
      // Include some metadata for debugging
      metadata: {
        timestamp: new Date().toISOString(),
        ragie_status: ragieResponse.status,
        generate_status: generateResponse.status
      }
    }

    console.log(`Response for user ${user_uuid}:`, JSON.stringify(response, null, 2))

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Sync Ragie error:', error)
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      answer: 'I apologize, but I encountered an error while searching your documents. Please try asking your question again.',
      query: '',
      user_uuid: '',
      retrievals_count: 0
    }

    return new Response(
      JSON.stringify(errorResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})