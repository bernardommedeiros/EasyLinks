const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const jwt = require('jsonwebtoken')

const SECRET = 'segredo-super-simples'

const packageDef = protoLoader.loadSync('auth.proto')
const grpcObject = grpc.loadPackageDefinition(packageDef)
const authPackage = grpcObject.auth

function login(call, callback) {
  const { email, password } = call.request

  if (email === 'admin@gmail.com' && password === '12345') {
    const token = jwt.sign(
      { email },
      SECRET,
      { expiresIn: '1h' }
    )

    return callback(null, {
      success: true,
      token
    })
  }

  callback(null, {
    success: false,
    token: ''
  })
}

const server = new grpc.Server()
server.addService(authPackage.AuthService.service, { login })

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('🔥 gRPC Auth com JWT rodando')
    server.start()
  }
)
