import { NextResponse } from "next/server";

type Response = {
    status: number;
    message?: string;
    error?: string;
    data?: object;
      headers?: HeadersInit;
};


export default function response({message,status,error,data, headers}:Response) {
    return NextResponse.json({message,error,data},{status, headers});
}