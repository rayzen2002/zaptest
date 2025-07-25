import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

fastify.get('/', (request , reply)=> {
 const { 'hub.mode':mode, 'hub.challenge': challenge , 'hub.verify_token': token} = request.query

 if (mode === 'subscribe' && token === verifyToken) {
  console.log('WEBHOOK VERIFIED')
  reply.status(200).send(challenge)
 } else {
  reply.status(403).end()
 }
})

fastify.post('/', (request , reply)=> {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook receivec ${timestamp} \n`)
  console.log(JSON.stringify(request.body, null , 2))
  reply.statusCode(200)
})

fastify.listen({ port: 3000}, (err , address)=> {
  if(err){
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now running at Port 3000`)
})