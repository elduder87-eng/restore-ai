import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req) {
  try {
    const body = await req.json()
    const { nodeId, nodeLabel, unlockedNodes, recentQuestions, emotion } = body

    if (!nodeId) return Response.json({ applications: [] })

    // Build context about what the user knows
    const nodeNames = (unlockedNodes || []).map(id => {
      const nameMap = {
        phys:'Physics', astro:'Astronomy', math:'Mathematics', bio:'Biology',
        hist:'History', eth:'Philosophy', tech:'Technology', ai:'AI',
        psych:'Psychology', econ:'Economics', lit:'Literature', music:'Music',
        bh:'Black Holes', rel:'Relativity', neuro:'Neuroscience', env:'Environment',
        chem:'Chemistry', evol:'Evolution', gen:'Genetics', med:'Medicine',
        crim:'Criminology', law:'Law', soc:'Sociology', pol:'Politics',
        ling:'Linguistics', eng:'Engineering', geo:'Geology', biz:'Business',
        calc:'Calculus', art:'Art', film:'Film', arch:'Architecture', cul:'Culinary Arts',
        cosmo:'Cosmology', grav:'Gravity', newt:"Newton's Laws", st:'Space-Time',
        eco:'Ecosystems', anth:'Anthropology', ren:'Renaissance', rev:'Revolutions',
        ind:'Industrial Revolution', know:'Knowledge Theory', func:'Functions', lim:'Limits',
      }
      return nameMap[id] || id
    }).filter(Boolean)

    const questionsContext = recentQuestions && recentQuestions.length > 0
      ? `Recent questions they've asked: "${recentQuestions.slice(-5).join('", "')}"`
      : ''

    const prompt = `A person is learning about ${nodeLabel} using Restore, a knowledge galaxy app.

They have already explored these topics: ${nodeNames.join(', ')}.
${questionsContext}
Their current learning state: ${emotion || 'curious'}.

Generate exactly 4 specific, real-world applications that combine ${nodeLabel} with what they already know.
These should feel personally relevant — not generic textbook examples.
Each should be one sentence, starting with an action verb.
Make them feel exciting and achievable.
Format: Return ONLY a JSON array of 4 strings. No other text.
Example format: ["Build X using Y", "Design Z that combines A and B", "Create W by applying C to D", "Explore E through the lens of F"]`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200,
    })

    const raw = completion.choices?.[0]?.message?.content?.trim() || '[]'

    // Safely parse JSON
    let applications = []
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      applications = JSON.parse(cleaned)
      if (!Array.isArray(applications)) applications = []
      applications = applications.slice(0, 4)
    } catch (e) {
      // Fallback — extract lines if JSON fails
      applications = raw.split('\n')
        .filter(l => l.trim().startsWith('"') || l.trim().startsWith('-'))
        .map(l => l.replace(/^[-"*\s]+|["*\s]+$/g, ''))
        .filter(l => l.length > 10)
        .slice(0, 4)
    }

    return Response.json({ applications, nodeId })

  } catch (err) {
    console.error('APPLIED KNOWLEDGE ERROR:', err.message)
    return Response.json({ applications: [], error: true })
  }
}
