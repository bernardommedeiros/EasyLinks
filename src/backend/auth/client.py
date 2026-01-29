import grpc
import auth_pb2
import auth_pb2_grpc

channel = grpc.insecure_channel("localhost:50051")
client = auth_pb2_grpc.AuthServiceStub(channel)

def login(email, password):
    response = client.Login(
        auth_pb2.LoginRequest(
            email=email,
            password=password
        )
    )
    return response

if __name__ == "__main__":
    res = login("admin@gmail.com", "12345")

    if res.success:
        print("Login OK")
        print("TOKEN:", res.token)
    else:
        print("Login inválido")
