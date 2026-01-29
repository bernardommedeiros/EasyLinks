import grpc
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import auth_pb2
import auth_pb2_grpc

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

channel = grpc.insecure_channel("localhost:50051")
grpc_client = auth_pb2_grpc.AuthServiceStub(channel)

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
def login(data: LoginRequest):
    response = grpc_client.Login(
        auth_pb2.LoginRequest(
            email=data.email,
            password=data.password
        )
    )

    return {
        "success": response.success,
        "token": response.token
    }
