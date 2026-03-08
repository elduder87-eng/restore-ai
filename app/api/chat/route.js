export async function POST(req){

const { message } = await req.json()

// simple response placeholder

return Response.json({

reply: `Let's think about that. You asked: "${message}". What connections do you see with things you've explored before?`

})

}
